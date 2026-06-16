import { Navigate, Outlet } from 'react-router-dom';
import { checkAuth } from '../api/checkAuth';
import { useEffect, useState } from 'react';
import { selectUser } from '../slices/userSlice';
import { useSelector } from 'react-redux';

export const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuth = await checkAuth();
      setIsAuthenticated(isAuth);
    };

    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Проверка авторизации...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
