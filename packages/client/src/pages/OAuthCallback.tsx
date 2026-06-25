import React from 'react';
import { Navigate } from 'react-router-dom';
import { useOAuth } from '../hooks/useOAuth';

export const OAuthCallback: React.FC = () => {
  // Используем useOAuth напрямую для обработки callback
  const { isLoading, error, isAuthenticated } = useOAuth();

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
        <button onClick={() => (window.location.href = '/')}>Вернуться на главную</button>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <div>Ожидание авторизации...</div>;
};
