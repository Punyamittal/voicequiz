import { FaTrophy } from 'react-icons/fa';
import './Leaderboard.css';

interface LeaderboardEntry {
  rank: number;
  name: string;
  email: string;
  totalScore: number;
  accuracy: number;
  averageSpeed: number;
  totalCorrect: number;
  totalWrong: number;
}

interface LeaderboardProps {
  leaderboard: LeaderboardEntry[];
}

const Leaderboard = ({ leaderboard }: LeaderboardProps) => {
  return (
    <div className="leaderboard">
      <h3 className="leaderboard-title">
        <FaTrophy style={{ marginRight: '8px' }} />
        Live Leaderboard
      </h3>
      <div className="leaderboard-list">
        {leaderboard.length === 0 ? (
          <div className="no-data">No data yet</div>
        ) : (
          leaderboard.map((entry) => (
            <div
              key={entry.rank}
              className={`leaderboard-item ${entry.rank <= 3 ? `rank-${entry.rank}` : ''}`}
            >
              <div className="rank-badge">#{entry.rank}</div>
              <div className="entry-info">
                <div className="entry-name">{entry.name}</div>
                <div className="entry-stats">
                  <span>Score: {entry.totalScore.toFixed(1)}</span>
                  <span>Accuracy: {entry.accuracy.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

