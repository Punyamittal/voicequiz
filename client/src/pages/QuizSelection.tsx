import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { FaBook } from 'react-icons/fa';
import './QuizSelection.css';

interface Quiz {
  id: string;
  title: string;
  description: string;
  total_questions: number;
  is_active: boolean;
  created_at: string;
}

const QuizSelection = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const res = await api.get('/quiz/available');
      setQuizzes(res.data.quizzes);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (quizId: string) => {
    try {
      await api.post('/quiz/start', { quizId, language: 'en' });
      navigate('/quiz');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to start quiz');
    }
  };

  if (loading) {
    return (
      <div className="quiz-selection-container">
        <div className="loading">Loading quizzes...</div>
      </div>
    );
  }

  return (
    <div className="quiz-selection-container">
      <div className="quiz-selection-header">
        <h1>
          <FaBook style={{ marginRight: '10px' }} />
          Available Quizzes
        </h1>
        <p>Select a quiz to begin</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {quizzes.length === 0 ? (
        <div className="no-quizzes">
          <p>No quizzes available at the moment.</p>
          <p>Please check back later or contact your administrator.</p>
        </div>
      ) : (
        <div className="quizzes-grid">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <div className="quiz-card-header">
                <h2>{quiz.title}</h2>
                <span className="quiz-status active">Active</span>
              </div>
              <p className="quiz-description">{quiz.description || 'No description available'}</p>
              <div className="quiz-info">
                <span>📝 {quiz.total_questions} Questions</span>
                <span>📅 {new Date(quiz.created_at).toLocaleDateString()}</span>
              </div>
              <button
                className="start-quiz-btn"
                onClick={() => handleStartQuiz(quiz.id)}
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizSelection;

