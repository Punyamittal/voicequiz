import express, { Response } from 'express';
import { supabase } from '../db/supabase.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';
import { calculatePoints } from '../utils/scoring.js';

const router = express.Router();

// Get available quizzes (public endpoint)
router.get('/available', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ quizzes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get current question
router.get('/current', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Get the most recent incomplete session
    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', req.userId)
      .eq('is_completed', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (sessionsError || !sessions || sessions.length === 0) {
      return res.status(404).json({ error: 'No active quiz session' });
    }

    const session = sessions[0];

    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', session.quiz_id)
      .eq('quiz_question_number', session.current_question)
      .single();

    if (questionError || !question) {
      // Check if quiz has any questions at all
      const { data: anyQuestion } = await supabase
        .from('questions')
        .select('id')
        .eq('quiz_id', session.quiz_id)
        .limit(1);
      
      if (!anyQuestion || anyQuestion.length === 0) {
        return res.status(404).json({ 
          error: 'This quiz has no questions yet. Please contact your administrator.',
          code: 'NO_QUESTIONS'
        });
      }
      
      // Question number doesn't exist - might be completed or invalid
      return res.status(404).json({ 
        error: `Question ${session.current_question} not found for this quiz`,
        code: 'QUESTION_NOT_FOUND'
      });
    }

    const translation = question.translations.find((t: any) => t.language === session.language) || question.translations[0];
    
    // Get quiz to get total questions
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('total_questions')
      .eq('id', session.quiz_id)
      .single();

    res.json({
      questionNumber: session.current_question,
      question: translation.questionText,
      options: translation.options.map((opt: any, idx: number) => ({ index: idx, text: opt.text })),
      language: session.language,
      startTime: session.start_time,
      totalQuestions: quiz?.total_questions || 50
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Submit answer
router.post('/answer', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { questionNumber, selectedOptionIndex, timeTaken } = req.body;

    // Get the most recent active session
    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', req.userId)
      .eq('is_completed', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (sessionsError || !sessions || sessions.length === 0) {
      return res.status(404).json({ error: 'No active quiz session' });
    }

    const session = sessions[0];

    if (session.current_question !== questionNumber) {
      return res.status(400).json({ error: 'Invalid question number' });
    }

    const { data: question, error: questionError } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', session.quiz_id)
      .eq('quiz_question_number', questionNumber)
      .single();

    if (questionError || !question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const translation = question.translations.find((t: any) => t.language === session.language) || question.translations[0];
    const isCorrect = translation.options[selectedOptionIndex]?.isCorrect || false;

    const { points, speedBonus, totalPoints } = calculatePoints(
      isCorrect,
      timeTaken,
      question.points,
      question.negative_points
    );

    // Check if answer already exists
    const { data: existingAnswer } = await supabase
      .from('answers')
      .select('*')
      .eq('user_id', req.userId)
      .eq('quiz_id', session.quiz_id)
      .eq('question_number', questionNumber)
      .single();

    const previousPoints = existingAnswer?.total_points || 0;
    const previousTime = existingAnswer?.time_taken || 0;
    
    let totalCorrect = session.total_correct;
    let totalWrong = session.total_wrong;
    let totalTime = session.total_time;

    if (existingAnswer) {
      // Update existing answer - adjust counts if correctness changed
      if (existingAnswer.is_correct && !isCorrect) {
        totalCorrect -= 1;
        totalWrong += 1;
      } else if (!existingAnswer.is_correct && isCorrect) {
        totalCorrect += 1;
        totalWrong -= 1;
      }
      
      // Adjust total time (subtract previous, add new)
      totalTime = totalTime - previousTime + timeTaken;
      
      const { error: updateError } = await supabase
        .from('answers')
        .update({
          selected_option_index: selectedOptionIndex,
          is_correct: isCorrect,
          time_taken: timeTaken,
          points,
          speed_bonus: speedBonus,
          total_points: totalPoints,
          answered_at: new Date().toISOString()
        })
        .eq('id', existingAnswer.id);

      if (updateError) throw updateError;
    } else {
      // Create new answer
      const { error: insertError } = await supabase
        .from('answers')
        .insert({
          user_id: req.userId,
          quiz_id: session.quiz_id,
          question_number: questionNumber,
          selected_option_index: selectedOptionIndex,
          is_correct: isCorrect,
          time_taken: timeTaken,
          points,
          speed_bonus: speedBonus,
          total_points: totalPoints
        });

      if (insertError) throw insertError;

      // Update counts and time for new answer
      if (isCorrect) {
        totalCorrect += 1;
      } else {
        totalWrong += 1;
      }
      totalTime += timeTaken;
    }

    // Update session
    const newTotalScore = parseFloat(session.total_score.toString()) - previousPoints + totalPoints;
    const newCurrentQuestion = questionNumber + 1;
    const averageSpeed = totalTime / (totalCorrect + totalWrong || 1);
    const accuracy = (totalCorrect / (totalCorrect + totalWrong || 1)) * 100;

    const updateData: any = {
      current_question: newCurrentQuestion,
      total_score: newTotalScore,
      total_correct: totalCorrect,
      total_wrong: totalWrong,
      total_time: totalTime,
      average_speed: averageSpeed,
      accuracy: accuracy
    };

    // Get quiz to check total questions
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('total_questions')
      .eq('id', session.quiz_id)
      .single();

    const totalQuestions = quiz?.total_questions || 50;

    if (newCurrentQuestion > totalQuestions) {
      updateData.is_completed = true;
      updateData.end_time = new Date().toISOString();
    }

    const { error: updateSessionError } = await supabase
      .from('quiz_sessions')
      .update(updateData)
      .eq('id', session.id);

    if (updateSessionError) throw updateSessionError;

    res.json({
      isCorrect,
      points: totalPoints,
      nextQuestion: newCurrentQuestion > (quiz?.total_questions || 50) ? null : newCurrentQuestion
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start quiz
router.post('/start', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { quizId, language } = req.body;

    if (!quizId) {
      return res.status(400).json({ error: 'Quiz ID is required' });
    }

    // Get quiz to get total questions first
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('total_questions')
      .eq('id', quizId)
      .single();

    if (quizError || !quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Check for existing incomplete session for this quiz
    const { data: existingSessions, error: sessionCheckError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', req.userId)
      .eq('quiz_id', quizId)
      .eq('is_completed', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (sessionCheckError) {
      throw sessionCheckError;
    }

    if (existingSessions && existingSessions.length > 0) {
      const existingSession = existingSessions[0];
      return res.json({ 
        sessionId: existingSession.id, 
        currentQuestion: existingSession.current_question,
        totalQuestions: quiz.total_questions 
      });
    }

    // Insert session - only include total_questions if column exists
    // For now, we'll get it from the quiz instead
    const { data: session, error } = await supabase
      .from('quiz_sessions')
      .insert({
        user_id: req.userId,
        quiz_id: quizId,
        language: language || 'en',
        current_question: 1
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating quiz session:', error);
      throw error;
    }

    if (!session) {
      return res.status(500).json({ error: 'Failed to create quiz session' });
    }

    res.json({ sessionId: session.id, currentQuestion: 1, totalQuestions: quiz.total_questions });
  } catch (error: any) {
    console.error('Error in /quiz/start:', error);
    res.status(500).json({ error: error.message || 'Failed to start quiz' });
  }
});

// Get results
router.get('/results', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    // Get the most recent completed session, or the most recent session if none completed
    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', req.userId)
      .order('is_completed', { ascending: false }) // Completed sessions first
      .order('created_at', { ascending: false }) // Then by most recent
      .limit(1);

    if (sessionsError || !sessions || sessions.length === 0) {
      return res.status(404).json({ error: 'No quiz session found' });
    }

    const session = sessions[0];

    const { data: answers, error: answersError } = await supabase
      .from('answers')
      .select('*')
      .eq('user_id', req.userId)
      .eq('quiz_id', session.quiz_id)
      .order('question_number', { ascending: true });

    if (answersError) throw answersError;

    // Calculate strengths and weaknesses
    const questionStats = answers.map((answer) => ({
      questionNumber: answer.question_number,
      isCorrect: answer.is_correct,
      timeTaken: answer.time_taken
    }));

    const strengths = questionStats.filter(s => s.isCorrect && s.timeTaken < 15).length;
    const weaknesses = questionStats.filter(s => !s.isCorrect).length;

    res.json({
      totalScore: parseFloat(session.total_score.toString()),
      totalCorrect: session.total_correct,
      totalWrong: session.total_wrong,
      totalTime: session.total_time,
      averageSpeed: parseFloat(session.average_speed.toString()),
      accuracy: parseFloat(session.accuracy.toString()),
      isCompleted: session.is_completed,
      strengths,
      weaknesses,
      answers: questionStats
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update language
router.put('/language', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { language } = req.body;
    
    // Get the most recent incomplete session
    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('user_id', req.userId)
      .eq('is_completed', false)
      .order('created_at', { ascending: false })
      .limit(1);

    if (sessionsError || !sessions || sessions.length === 0) {
      return res.status(404).json({ error: 'No active quiz session' });
    }

    const session = sessions[0];

    const { error } = await supabase
      .from('quiz_sessions')
      .update({ language })
      .eq('id', session.id);

    if (error) throw error;

    res.json({ message: 'Language updated', language });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user rank
router.get('/rank', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { data: sessions, error } = await supabase
      .from('quiz_sessions')
      .select('user_id, total_score, accuracy')
      .eq('is_completed', true)
      .order('total_score', { ascending: false })
      .order('accuracy', { ascending: false });

    if (error) throw error;

    const userRank = sessions.findIndex(
      (s) => s.user_id === req.userId
    );

    res.json({ rank: userRank >= 0 ? userRank + 1 : null });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
