import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login      from './components/Login';
import Register   from './components/Register';
import Dashboard  from './components/Dashboard';

const ProtectedRoute = ({ children }) =>
  localStorage.getItem('token') ? children : <Navigate to="/login" replace />;

const PublicRoute = ({ children }) =>
  localStorage.getItem('token') ? <Navigate to="/dashboard" replace /> : children;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login"     element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register"  element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*"          element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
