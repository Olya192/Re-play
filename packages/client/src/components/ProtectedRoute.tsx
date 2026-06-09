import { Navigate, Outlet } from 'react-router-dom';
import { checkAuth } from '../api/checkAuth';
import { useEffect, useState } from 'react';

export const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      setIsAuthenticated(isAuth);
      setLoading(false);
    };

    verifyAuth();
  }, []);

  if (loading) {
    return <div>Проверка авторизации...</div>; // или ваш компонент загрузки
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
