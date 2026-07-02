import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useOAuth } from '../hooks/useOAuth';

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useOAuth();

  const handleNavigateHome = () => {
    navigate('/', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="oauth-callback loading">
        <div className="loader">Обработка авторизации...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="oauth-callback error">
        <h2>Ошибка авторизации</h2>
        <p>{error}</p>
        <button onClick={handleNavigateHome}>Вернуться на главную</button>
      </div>
    );
  }

  // После завершения авторизации всегда перенаправляем
  return <Navigate to="/" replace />;
};
