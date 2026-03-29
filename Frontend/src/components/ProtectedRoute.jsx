import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Agar token nahi hai, toh seedha login page par bhej do
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Agar token hai, toh dashboard dikhao
  return children;
};

export default ProtectedRoute;