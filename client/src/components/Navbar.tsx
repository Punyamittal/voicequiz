import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FaBullseye, FaCog, FaBook, FaChartBar, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!token) {
    return null; // Don't show navbar on login page
  }

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/quizzes" className="navbar-brand">
          <FaBullseye style={{ marginRight: '8px' }} />
          VoiceItQuiz
        </Link>
        
        <div className="navbar-links">
          {user?.role === 'admin' && (
            <Link to="/admin" className={`navbar-link ${isActive('/admin')}`}>
              <FaCog style={{ marginRight: '6px' }} />
              Admin
            </Link>
          )}
          <Link to="/quizzes" className={`navbar-link ${isActive('/quizzes')}`}>
            <FaBook style={{ marginRight: '6px' }} />
            Quizzes
          </Link>
          <Link to="/results" className={`navbar-link ${isActive('/results')}`}>
            <FaChartBar style={{ marginRight: '6px' }} />
            Results
          </Link>
          <div className="navbar-user">
            <span className="user-name">
              <FaUser style={{ marginRight: '6px' }} />
              {user?.name}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <FaSignOutAlt style={{ marginRight: '6px' }} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
