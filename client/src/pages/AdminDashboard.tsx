import { useState, useEffect } from 'react';
import api from '../api/axios';
import { FaCog } from 'react-icons/fa';
import './AdminDashboard.css';

interface Quiz {
  id: string;
  title: string;
  description: string;
  total_questions: number;
  is_active: boolean;
  created_at: string;
}

interface Question {
  id: string;
  quiz_question_number: number;
  translations: Array<{
    language: string;
    questionText: string;
    options: Array<{
      text: string;
      isCorrect: boolean;
    }>;
  }>;
  points: number;
  negative_points: number;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'quizzes' | 'questions' | 'analytics' | 'leaderboard' | 'online'>('quizzes');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Quiz creation form
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    totalQuestions: 50
  });

  // Question form
  const [newQuestion, setNewQuestion] = useState({
    questionNumber: 1,
    translations: [
      { language: 'en', questionText: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] }
    ],
    points: 4,
    negativePoints: 1
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [activeTab, selectedQuiz]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'quizzes') {
        const res = await api.get('/admin/quizzes');
        setQuizzes(res.data.quizzes);
      } else if (activeTab === 'questions' && selectedQuiz) {
        const res = await api.get(`/admin/quizzes/${selectedQuiz.id}/questions`);
        setQuestions(res.data.questions);
      } else if (activeTab === 'analytics') {
        const res = await api.get('/admin/analytics');
        setAnalytics(res.data);
      } else if (activeTab === 'leaderboard') {
        const res = await api.get('/admin/leaderboard');
        setLeaderboard(res.data.leaderboard);
      } else if (activeTab === 'online') {
        const res = await api.get('/admin/online-users');
        setOnlineUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    try {
      const res = await api.post('/admin/quizzes', newQuiz);
      alert('Quiz created successfully!');
      setNewQuiz({ title: '', description: '', totalQuestions: 50 });
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create quiz');
    }
  };

  const handleAddTranslation = () => {
    setNewQuestion({
      ...newQuestion,
      translations: [
        ...newQuestion.translations,
        { language: 'en', questionText: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] }
      ]
    });
  };

  const handleSaveQuestion = async () => {
    if (!selectedQuiz) {
      alert('Please select a quiz first');
      return;
    }

    try {
      await api.post('/admin/questions', {
        ...newQuestion,
        quizId: selectedQuiz.id
      });
      alert('Question saved successfully!');
      setNewQuestion({
        questionNumber: questions.length + 1,
        translations: [
          { language: 'en', questionText: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }, { text: '', isCorrect: false }] }
        ],
        points: 4,
        negativePoints: 1
      });
      loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save question');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>
          <FaCog style={{ marginRight: '10px' }} />
          Admin Dashboard
        </h1>
        <p className="admin-subtitle">Manage quizzes, questions, and view analytics</p>
        <div className="admin-tabs">
          <button
            className={activeTab === 'quizzes' ? 'active' : ''}
            onClick={() => { setActiveTab('quizzes'); setSelectedQuiz(null); }}
          >
            Quizzes
          </button>
          <button
            className={activeTab === 'questions' ? 'active' : ''}
            onClick={() => setActiveTab('questions')}
          >
            Questions
          </button>
          <button
            className={activeTab === 'analytics' ? 'active' : ''}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button
            className={activeTab === 'leaderboard' ? 'active' : ''}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
          <button
            className={activeTab === 'online' ? 'active' : ''}
            onClick={() => setActiveTab('online')}
          >
            Online Users
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'quizzes' && (
          <div className="quizzes-tab">
            <h2>Create New Quiz</h2>
            <div className="quiz-form">
              <label>
                Quiz Title:
                <input
                  type="text"
                  value={newQuiz.title}
                  onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                  placeholder="Enter quiz title"
                />
              </label>
              <label>
                Description:
                <textarea
                  value={newQuiz.description}
                  onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  placeholder="Enter quiz description"
                  rows={3}
                />
              </label>
              <label>
                Total Questions:
                <input
                  type="number"
                  value={newQuiz.totalQuestions}
                  onChange={(e) => setNewQuiz({ ...newQuiz, totalQuestions: parseInt(e.target.value) || 50 })}
                  min={1}
                />
              </label>
              <button onClick={handleCreateQuiz} className="save-btn">Create Quiz</button>
            </div>

            <h2>All Quizzes ({quizzes.length})</h2>
            <div className="quizzes-list">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="quiz-item" onClick={() => setSelectedQuiz(quiz)}>
                  <div className="quiz-header-item">
                    <strong>{quiz.title}</strong>
                    <span className={`status ${quiz.is_active ? 'active' : 'inactive'}`}>
                      {quiz.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="quiz-description">{quiz.description || 'No description'}</div>
                  <div className="quiz-meta">
                    <span>Questions: {quiz.total_questions}</span>
                    <span>Created: {new Date(quiz.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="questions-tab">
            {!selectedQuiz ? (
              <div>
                <h2>Select a Quiz</h2>
                <p>Please select a quiz from the Quizzes tab to add questions.</p>
                <div className="quizzes-list">
                  {quizzes.filter(q => q.is_active).map((quiz) => (
                    <div key={quiz.id} className="quiz-item" onClick={() => { setSelectedQuiz(quiz); setActiveTab('questions'); }}>
                      <strong>{quiz.title}</strong>
                      <div>Questions: {quiz.total_questions}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="selected-quiz-header">
                  <h2>Add Questions to: {selectedQuiz.title}</h2>
                  <button onClick={() => setSelectedQuiz(null)} className="back-btn">← Back to Quizzes</button>
                </div>
                <div className="question-form">
                  <label>
                    Question Number:
                    <input
                      type="number"
                      value={newQuestion.questionNumber}
                      onChange={(e) => setNewQuestion({ ...newQuestion, questionNumber: parseInt(e.target.value) || 1 })}
                      min={1}
                      max={selectedQuiz.total_questions}
                    />
                  </label>
                  
                  {newQuestion.translations.map((trans, idx) => (
                    <div key={idx} className="translation-section">
                      <label>
                        Language:
                        <select
                          value={trans.language}
                          onChange={(e) => {
                            const newTranslations = [...newQuestion.translations];
                            newTranslations[idx].language = e.target.value;
                            setNewQuestion({ ...newQuestion, translations: newTranslations });
                          }}
                        >
                          <option value="en">English</option>
                          <option value="hi">Hindi</option>
                          <option value="ta">Tamil</option>
                          <option value="te">Telugu</option>
                          <option value="kn">Kannada</option>
                        </select>
                      </label>
                      <label>
                        Question Text:
                        <textarea
                          value={trans.questionText}
                          onChange={(e) => {
                            const newTranslations = [...newQuestion.translations];
                            newTranslations[idx].questionText = e.target.value;
                            setNewQuestion({ ...newQuestion, translations: newTranslations });
                          }}
                          rows={3}
                        />
                      </label>
                      <div className="options-section">
                        {trans.options.map((opt, optIdx) => (
                          <div key={optIdx} className="option-input">
                            <input
                              type="text"
                              placeholder={`Option ${optIdx + 1}`}
                              value={opt.text}
                              onChange={(e) => {
                                const newTranslations = [...newQuestion.translations];
                                newTranslations[idx].options[optIdx].text = e.target.value;
                                setNewQuestion({ ...newQuestion, translations: newTranslations });
                              }}
                            />
                            <label>
                              <input
                                type="radio"
                                name={`correct-${idx}`}
                                checked={opt.isCorrect}
                                onChange={() => {
                                  const newTranslations = [...newQuestion.translations];
                                  newTranslations[idx].options.forEach((o, i) => {
                                    o.isCorrect = i === optIdx;
                                  });
                                  setNewQuestion({ ...newQuestion, translations: newTranslations });
                                }}
                              />
                              Correct
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={handleAddTranslation}>+ Add Translation</button>
                  
                  <label>
                    Points for Correct:
                    <input
                      type="number"
                      value={newQuestion.points}
                      onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 4 })}
                    />
                  </label>
                  
                  <label>
                    Negative Points for Wrong:
                    <input
                      type="number"
                      value={newQuestion.negativePoints}
                      onChange={(e) => setNewQuestion({ ...newQuestion, negativePoints: parseInt(e.target.value) || 1 })}
                    />
                  </label>
                  
                  <button onClick={handleSaveQuestion} className="save-btn">Save Question</button>
                </div>

                <h2>Existing Questions ({questions.length})</h2>
                <div className="questions-list">
                  {questions.map((q) => (
                    <div key={q.id} className="question-item">
                      <strong>Q{q.quiz_question_number}</strong>
                      <div>Languages: {q.translations.map(t => t.language).join(', ')}</div>
                      <div>Points: +{q.points} / -{q.negative_points}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'analytics' && analytics && (
          <div className="analytics-tab">
            <div className="analytics-grid">
              <div className="analytics-card">
                <div className="analytics-value">{analytics.totalUsers}</div>
                <div className="analytics-label">Total Users</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-value">{analytics.completedSessions}</div>
                <div className="analytics-label">Completed Sessions</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-value">{analytics.activeSessions}</div>
                <div className="analytics-label">Active Sessions</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-value">{analytics.averageScore.toFixed(1)}</div>
                <div className="analytics-label">Average Score</div>
              </div>
              <div className="analytics-card">
                <div className="analytics-value">{analytics.averageAccuracy.toFixed(1)}%</div>
                <div className="analytics-label">Average Accuracy</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="leaderboard-tab">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Score</th>
                  <th>Accuracy</th>
                  <th>Avg Speed</th>
                  <th>Correct</th>
                  <th>Wrong</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry.rank}>
                    <td>#{entry.rank}</td>
                    <td>{entry.name}</td>
                    <td>{entry.email}</td>
                    <td>{entry.totalScore.toFixed(1)}</td>
                    <td>{entry.accuracy.toFixed(1)}%</td>
                    <td>{entry.averageSpeed.toFixed(1)}s</td>
                    <td>{entry.totalCorrect}</td>
                    <td>{entry.totalWrong}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'online' && (
          <div className="online-tab">
            <h2>Online Users ({onlineUsers.length})</h2>
            <div className="online-users-list">
              {onlineUsers.map((user) => (
                <div key={user.id} className="online-user-item">
                  <div>{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
