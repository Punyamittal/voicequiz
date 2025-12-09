import express, { Response } from 'express';
import { supabase } from '../db/supabase.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

// Create quiz
router.post('/quizzes', async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, totalQuestions } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Quiz title is required' });
    }

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .insert({
        title,
        description: description || '',
        total_questions: totalQuestions || 50,
        created_by: req.userId,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Quiz created', quiz });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all quizzes
router.get('/quizzes', async (req: AuthRequest, res: Response) => {
  try {
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ quizzes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get quiz with questions
router.get('/quizzes/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', id)
      .single();

    if (quizError) throw quizError;

    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', id)
      .order('quiz_question_number', { ascending: true });

    if (questionsError) throw questionsError;

    res.json({ quiz, questions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update quiz
router.put('/quizzes/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, totalQuestions, isActive } = req.body;

    const updateData: any = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (totalQuestions) updateData.total_questions = totalQuestions;
    if (isActive !== undefined) updateData.is_active = isActive;

    const { data: quiz, error } = await supabase
      .from('quizzes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Quiz updated', quiz });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Upload question (updated to support quiz_id)
router.post('/questions', async (req: AuthRequest, res: Response) => {
  try {
    const { quizId, questionNumber, translations, points, negativePoints } = req.body;

    if (!quizId) {
      return res.status(400).json({ error: 'Quiz ID is required' });
    }

    if (questionNumber === undefined || questionNumber === null) {
      return res.status(400).json({ error: 'Question number is required' });
    }

    // Check if question already exists for this quiz
    const { data: existingQuestion } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)
      .eq('quiz_question_number', questionNumber)
      .single();

    if (existingQuestion) {
      const { data: question, error } = await supabase
        .from('questions')
        .update({
          translations,
          points: points || 4,
          negative_points: negativePoints || 1
        })
        .eq('id', existingQuestion.id)
        .select()
        .single();

      if (error) throw error;
      res.json({ message: 'Question updated', question });
    } else {
      // Insert new question
      // Note: question_number is a legacy field - we use quiz_question_number per quiz
      // We'll set question_number to the same value, but it may not be unique globally
      const insertData: any = {
        quiz_id: quizId,
        quiz_question_number: questionNumber,
        question_number: questionNumber, // Always set it (legacy field, may have duplicates)
        translations,
        points: points || 4,
        negative_points: negativePoints || 1
      };

      const { data: question, error } = await supabase
        .from('questions')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        // If error is about unique constraint on question_number (legacy field)
        if (error.message?.includes('question_number') && (error.message?.includes('unique constraint') || error.code === '23505')) {
          // Try again without question_number (if column allows null)
          // Or use the same question_number anyway (if unique constraint was removed)
          // For now, just set it to null and let the migration handle it
          try {
            const insertDataWithoutLegacy = { ...insertData };
            delete insertDataWithoutLegacy.question_number;
            
            const { data: question2, error: error2 } = await supabase
              .from('questions')
              .insert(insertDataWithoutLegacy)
              .select()
              .single();
            
            if (error2) throw error2;
            res.json({ message: 'Question saved', question: question2 });
            return;
          } catch (err2: any) {
            // If that also fails (NOT NULL constraint), use upsert on quiz_question_number
            if (err2.message?.includes('not-null constraint')) {
              // question_number is required, so we need to handle the conflict differently
              // Use a different approach: try to find an available question_number
              throw new Error(`Question number ${questionNumber} conflicts with existing question. Please run the migration script to allow duplicate question_numbers.`);
            }
            throw err2;
          }
        }
        // If error is about unique constraint on (quiz_id, quiz_question_number)
        if (error.message?.includes('quiz_question_number') && (error.message?.includes('unique constraint') || error.code === '23505')) {
          throw new Error(`Question number ${questionNumber} already exists for this quiz. Please use a different question number.`);
        }
        throw error;
      }
      res.json({ message: 'Question saved', question });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get questions for a quiz
router.get('/quizzes/:quizId/questions', async (req: AuthRequest, res: Response) => {
  try {
    const { quizId } = req.params;

    const { data: questions, error } = await supabase
      .from('questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('quiz_question_number', { ascending: true });

    if (error) throw error;
    res.json({ questions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all questions (for backward compatibility)
router.get('/questions', async (req: AuthRequest, res: Response) => {
  try {
    const { quizId } = req.query;

    let query = supabase
      .from('questions')
      .select('*');

    if (quizId) {
      query = query.eq('quiz_id', quizId);
    }

    const { data: questions, error } = await query.order('quiz_question_number', { ascending: true });

    if (error) throw error;
    res.json({ questions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req: AuthRequest, res: Response) => {
  try {
    const { data: sessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('*')
      .eq('is_completed', true)
      .order('total_score', { ascending: false })
      .order('accuracy', { ascending: false })
      .limit(200);

    if (sessionsError) throw sessionsError;

    // Get all user IDs
    const userIds = [...new Set(sessions.map((s: any) => s.user_id))];
    
    // Fetch users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email')
      .in('id', userIds);

    if (usersError) throw usersError;

    // Create user map
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    const leaderboard = sessions.map((session: any, index: number) => {
      const user = userMap.get(session.user_id);
      return {
        rank: index + 1,
        name: user?.name || 'Unknown',
        email: user?.email || 'Unknown',
        totalScore: parseFloat(session.total_score.toString()),
        accuracy: parseFloat(session.accuracy.toString()),
        averageSpeed: parseFloat(session.average_speed.toString()),
        totalCorrect: session.total_correct,
        totalWrong: session.total_wrong
      };
    });

    res.json({ leaderboard });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get online users
router.get('/online-users', async (req: AuthRequest, res: Response) => {
  try {
    const { data: activeSessions, error: sessionsError } = await supabase
      .from('quiz_sessions')
      .select('user_id')
      .eq('is_completed', false);

    if (sessionsError) throw sessionsError;

    const userIds = activeSessions.map(s => s.user_id);
    
    if (userIds.length === 0) {
      return res.json({ count: 0, users: [] });
    }

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email')
      .in('id', userIds);

    if (usersError) throw usersError;
    
    res.json({ count: users.length, users });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get analytics
router.get('/analytics', async (req: AuthRequest, res: Response) => {
  try {
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student');

    const { count: completedSessions } = await supabase
      .from('quiz_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('is_completed', true);

    const { count: activeSessions } = await supabase
      .from('quiz_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('is_completed', false);

    const { data: completedSessionsData } = await supabase
      .from('quiz_sessions')
      .select('total_score, accuracy')
      .eq('is_completed', true);

    let averageScore = 0;
    let averageAccuracy = 0;

    if (completedSessionsData && completedSessionsData.length > 0) {
      const totalScore = completedSessionsData.reduce((sum, s) => sum + parseFloat(s.total_score.toString()), 0);
      const totalAccuracy = completedSessionsData.reduce((sum, s) => sum + parseFloat(s.accuracy.toString()), 0);
      averageScore = totalScore / completedSessionsData.length;
      averageAccuracy = totalAccuracy / completedSessionsData.length;
    }

    res.json({
      totalUsers: totalUsers || 0,
      completedSessions: completedSessions || 0,
      activeSessions: activeSessions || 0,
      averageScore,
      averageAccuracy
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
