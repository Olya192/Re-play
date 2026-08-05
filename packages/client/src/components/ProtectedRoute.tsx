import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = () => {
  const { isLoading, isAuthenticated } = useAuth();

  console.log('ProtectedRoute:', { isLoading, isAuthenticated });

  if (isLoading) {
    return <div className="loader">Проверка авторизации...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
