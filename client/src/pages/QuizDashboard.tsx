import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useQuizStore } from '../store/quizStore';
import api from '../api/axios';
import LanguageSelector from '../components/LanguageSelector';
import Leaderboard from '../components/Leaderboard';
import { FaTrophy, FaClock } from 'react-icons/fa';
import './QuizDashboard.css';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'kn', name: 'ಕನ್ನಡ' }
];

const QuizDashboard = () => {
  const [question, setQuestion] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [overallTimer, setOverallTimer] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const questionStartTime = useRef<number>(Date.now());
  const overallStartTime = useRef<number>(Date.now());
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();
  const { token, user } = useAuthStore();
  const { language, setLanguage } = useQuizStore();

  useEffect(() => {
    initializeQuiz();
    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (question) {
      questionStartTime.current = Date.now();
      setQuestionTimer(0);
    }
  }, [question?.questionNumber]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (question) {
        setQuestionTimer(Math.floor((Date.now() - questionStartTime.current) / 1000));
      }
      setOverallTimer(Math.floor((Date.now() - overallStartTime.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [question]);

  const initializeQuiz = async () => {
    try {
      setIsLoading(true);
      // Check if there's already an active session
      try {
        await loadCurrentQuestion();
      } catch {
        // No active session, redirect to quiz selection
        navigate('/quizzes');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load quiz');
      navigate('/quizzes');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentQuestion = async () => {
    try {
      const res = await api.get('/quiz/current');
      setQuestion(res.data);
      setSelectedOption(null);
      if (res.data.startTime) {
        overallStartTime.current = new Date(res.data.startTime).getTime();
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        const errorCode = err.response?.data?.code;
        const errorMessage = err.response?.data?.error || 'Not found';
        
        if (errorCode === 'NO_QUESTIONS') {
          // Quiz has no questions
          setError(errorMessage);
        } else if (errorCode === 'QUESTION_NOT_FOUND') {
          // Question number doesn't exist - might be quiz completed
          // Check if session is completed
          try {
            const resultsRes = await api.get('/quiz/results');
            if (resultsRes.data.isCompleted) {
              navigate('/results');
              return;
            }
          } catch {
            // No results, show error
            setError(errorMessage);
          }
        } else if (errorMessage.includes('No active quiz session')) {
          // No active session - check if completed
          try {
            const resultsRes = await api.get('/quiz/results');
            if (resultsRes.data.isCompleted) {
              navigate('/results');
              return;
            }
          } catch {
            // No results either, redirect to quiz selection
            navigate('/quizzes');
            return;
          }
        } else {
          // Other 404 - redirect to quiz selection
          navigate('/quizzes');
        }
      } else {
        setError(err.response?.data?.error || 'Failed to load question');
      }
    }
  };

  const setupSocket = () => {
    if (!token) return;

    // Use environment variable or default to localhost:5000
    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socket = io(socketUrl, {
      auth: { token }
    });

    socket.on('leaderboard-update', (data) => {
      setLeaderboard(data.leaderboard);
    });

    socket.on('connect', () => {
      socket.emit('request-leaderboard');
    });

    socketRef.current = socket;
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    
    // Auto-save answer
    const timeTaken = Math.floor((Date.now() - questionStartTime.current) / 1000);
    saveAnswer(optionIndex, timeTaken);
  };

  const saveAnswer = async (optionIndex: number, timeTaken: number) => {
    try {
      const res = await api.post('/quiz/answer', {
        questionNumber: question.questionNumber,
        selectedOptionIndex: optionIndex,
        timeTaken
      });

      // Move to next question after a brief delay
      setTimeout(() => {
        if (res.data.nextQuestion) {
          loadCurrentQuestion();
        } else {
          navigate('/results');
        }
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save answer');
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    try {
      await api.put('/quiz/language', { language: newLanguage });
      setLanguage(newLanguage);
      await loadCurrentQuestion();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to change language');
    }
  };

  if (isLoading) {
    return (
      <div className="quiz-container">
        <div className="loading">Loading quiz...</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="quiz-container">
        <div className="error">No question available</div>
      </div>
    );
  }

  const progress = (question.questionNumber / question.totalQuestions) * 100;

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <LanguageSelector
          languages={LANGUAGES}
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
        <button
          className="leaderboard-toggle"
          onClick={() => setShowLeaderboard(!showLeaderboard)}
        >
          <FaTrophy style={{ marginRight: '8px' }} />
          Leaderboard
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="quiz-content">
        <div className="quiz-main">
          <div className="progress-section">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="progress-text">
              Question {question.questionNumber} of {question.totalQuestions}
            </div>
          </div>

          <div className="timer-section">
            <div className="timer">
              <FaClock style={{ marginRight: '6px' }} />
              <span>Question: {formatTime(questionTimer)}</span>
            </div>
            <div className="timer">
              <FaClock style={{ marginRight: '6px' }} />
              <span>Total: {formatTime(overallTimer)}</span>
            </div>
          </div>

          <div className="question-card">
            <h2 className="question-text">{question.question}</h2>
            <div className="options">
              {question.options.map((opt: any, idx: number) => (
                <button
                  key={idx}
                  className={`option ${selectedOption === idx ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(idx)}
                  disabled={selectedOption !== null}
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {showLeaderboard && (
          <div className="leaderboard-sidebar">
            <Leaderboard leaderboard={leaderboard} />
          </div>
        )}
      </div>
    </div>
  );
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default QuizDashboard;

