import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/axios';
import { FaCheckCircle, FaClock, FaChartBar, FaDownload, FaBook } from 'react-icons/fa';
import './Results.css';

interface ResultsData {
  totalScore: number;
  totalCorrect: number;
  totalWrong: number;
  totalTime: number;
  averageSpeed: number;
  accuracy: number;
  isCompleted: boolean;
  strengths: number;
  weaknesses: number;
  answers: Array<{
    questionNumber: number;
    isCorrect: boolean;
    timeTaken: number;
  }>;
}

const Results = () => {
  const [results, setResults] = useState<ResultsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const res = await api.get('/quiz/results');
      setResults(res.data);

      // Get user rank
      try {
        const rankRes = await api.get('/quiz/rank');
        setRank(rankRes.data.rank);
      } catch {
        setRank(null);
      }
    } catch (err: any) {
      console.error('Failed to load results:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!results) return;

    const report = `
VoiceItQuiz - Results Report
============================

Name: ${user?.name}
Email: ${user?.email}
Date: ${new Date().toLocaleDateString()}

SCORE SUMMARY
-------------
Total Score: ${results.totalScore.toFixed(2)}
Correct Answers: ${results.totalCorrect}
Wrong Answers: ${results.totalWrong}
Accuracy: ${results.accuracy.toFixed(2)}%

TIME ANALYSIS
-------------
Total Time: ${formatTime(results.totalTime)}
Average Speed: ${results.averageSpeed.toFixed(2)} seconds per question

PERFORMANCE
-----------
Strengths: ${results.strengths} questions (fast & correct)
Weaknesses: ${results.weaknesses} questions (incorrect)

Rank: ${rank ? `#${rank}` : 'Not available'}

DETAILED ANSWERS
----------------
${results.answers.map(a => 
  `Q${a.questionNumber}: ${a.isCorrect ? '✓' : '✗'} (${a.timeTaken}s)`
).join('\n')}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${user?.email}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="results-container">
        <div className="loading">Loading results...</div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-container">
        <div className="error">No results available</div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-card">
        <h1 className="results-title">
          <FaCheckCircle style={{ marginRight: '10px' }} />
          Quiz Completed!
        </h1>

        <div className="score-section">
          <div className="score-circle">
            <div className="score-value">{results.totalScore.toFixed(1)}</div>
            <div className="score-label">Total Score</div>
          </div>
          {rank && (
            <div className="rank-badge-large">
              <div className="rank-number">#{rank}</div>
              <div className="rank-label">Rank</div>
            </div>
          )}
        </div>

        <div className="stats-grid">
          <div className="stat-card correct">
            <div className="stat-value">{results.totalCorrect}</div>
            <div className="stat-label">Correct</div>
          </div>
          <div className="stat-card wrong">
            <div className="stat-value">{results.totalWrong}</div>
            <div className="stat-label">Wrong</div>
          </div>
          <div className="stat-card accuracy">
            <div className="stat-value">{results.accuracy.toFixed(1)}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-card speed">
            <div className="stat-value">{results.averageSpeed.toFixed(1)}s</div>
            <div className="stat-label">Avg Speed</div>
          </div>
        </div>

        <div className="time-section">
          <h3>
            <FaClock style={{ marginRight: '8px' }} />
            Time Analysis
          </h3>
          <div className="time-info">
            <span>Total Time: {formatTime(results.totalTime)}</span>
          </div>
        </div>

        <div className="performance-section">
          <h3>
            <FaChartBar style={{ marginRight: '8px' }} />
            Performance
          </h3>
          <div className="performance-grid">
            <div className="performance-item strength">
              <div className="performance-value">{results.strengths}</div>
              <div className="performance-label">Strengths (Fast & Correct)</div>
            </div>
            <div className="performance-item weakness">
              <div className="performance-value">{results.weaknesses}</div>
              <div className="performance-label">Weaknesses (Incorrect)</div>
            </div>
          </div>
        </div>

        <div className="actions">
          <button onClick={downloadReport} className="download-btn">
            <FaDownload style={{ marginRight: '8px' }} />
            Download Report
          </button>
          <button onClick={() => navigate('/quizzes')} className="retry-btn">
            <FaBook style={{ marginRight: '8px' }} />
            Back to Quizzes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;

