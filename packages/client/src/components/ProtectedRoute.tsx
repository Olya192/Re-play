import { Navigate, Outlet } from 'react-router-dom';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';

export const ProtectedRoute = () => {
  // Используем usePage для проверки авторизации
  const { isLoading, isAuthenticated } = usePage({ initPage: initError500 });

  if (isLoading) {
    return <div className="loader">Проверка авторизации...</div>;
  }

  if (!isAuthenticated) {
    // useOAuth сам сделает редирект, но на всякий случай
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const initError500 = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
