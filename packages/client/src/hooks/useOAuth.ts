import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { setUser } from '../slices/userSlice';
import { useDispatch } from 'react-redux';

export const useOAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const handleOAuthCallback = async (code: string) => {
      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }

        const redirectUri = sessionStorage.getItem('oauth_redirect_uri') || window.location.origin;

        const token = await authApi.exchangeCodeForToken(code, redirectUri);
        console.log('token', token);
        const user = await authApi.getCurrentUser();

        if (user) {
          dispatch(setUser(user));

          if (isMounted) {
            setIsAuthenticated(true);
          }

          sessionStorage.removeItem('oauth_in_progress');
          sessionStorage.removeItem('oauth_redirect_uri');
          navigate('/');
        } else {
          throw new Error('Не удалось получить данные пользователя');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Не удалось завершить авторизацию через Яндекс';
        console.error(`[OAuth Error]: ${errorMessage}`, error);

        if (isMounted) {
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Проверяем наличие code в URL
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');

    if (code) {
      handleOAuthCallback(code).catch((error) => {
        console.error('[OAuth Error]:', error);

        if (isMounted) {
          setError('Произошла критическая ошибка при авторизации');
          setIsLoading(false);
        }
      });
    } else {
      // Если code отсутствует, просто завершаем загрузку
      if (isMounted) {
        setIsLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [location.search, navigate, dispatch]);

  return {
    isLoading,
    error,
    isAuthenticated,
  };
};
