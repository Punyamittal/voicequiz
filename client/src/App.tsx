import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import QuizSelection from './pages/QuizSelection';
import QuizDashboard from './pages/QuizDashboard';
import Results from './pages/Results';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const { token } = useAuthStore();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/quizzes" /> : <Login />} />
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <QuizSelection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <ProtectedRoute>
              <QuizDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={token ? "/quizzes" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;

