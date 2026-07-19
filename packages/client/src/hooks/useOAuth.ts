import { useEffect, useState } from 'react';
import { checkAuth, getCurrentUser } from '../api/checkAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { setUser } from '../slices/userSlice';
import { useDispatch } from 'react-redux';
import { userApi } from '@/api/userApi';

export const useOAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    // Единая функция для обработки ошибок
    const handleError = (error: unknown, defaultMessage: string) => {
      const errorMessage = error instanceof Error ? error.message : defaultMessage;
      console.error(`[OAuth Error]: ${errorMessage}`, error);

      if (isMounted) {
        setError(errorMessage);
      }

      sessionStorage.removeItem('oauth_in_progress');
      sessionStorage.removeItem('oauth_redirect_uri');

      return errorMessage;
    };

    const initiateOAuth = async () => {
      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }

        const redirectUri = window.location.origin;
        const clientId = await authApi.getServiceID(redirectUri);

        const yandexAuthUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}`;

        sessionStorage.setItem('oauth_in_progress', 'true');
        sessionStorage.setItem('oauth_redirect_uri', redirectUri);

        window.location.assign(yandexAuthUrl);
      } catch (error) {
        handleError(error, 'Не удалось инициировать авторизацию через Яндекс');

        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const handleOAuthCallback = async (code: string) => {
      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }

        const redirectUri = sessionStorage.getItem('oauth_redirect_uri') || window.location.origin;

        await authApi.exchangeCodeForToken(code, redirectUri);
        const user = await authApi.getCurrentUser();

        if (user) {
          dispatch(setUser(user));

          const { login, displayName } = user;
          await userApi.createOrUpdateUser({ login, displayName });

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
        handleError(error, 'Не удалось завершить авторизацию через Яндекс');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const checkUserAuth = async () => {
      try {
        const isAuth = await checkAuth();

        const user = await getCurrentUser();

        if (isMounted) {
          setIsAuthenticated(isAuth);
        }

        if (isAuth && user) {
          dispatch(setUser(user));

          const { login, displayName } = user;
          await userApi.createOrUpdateUser({ login, displayName });
        }

        if (!isAuth) {
          sessionStorage.setItem('oauth_in_progress', 'false');
        }

        return isAuth;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Auth check failed';
        console.error(`[OAuth Error]: ${errorMessage}`, error);

        if (isMounted) {
          setIsAuthenticated(false);
        }

        sessionStorage.setItem('oauth_in_progress', 'false');

        return false;
      }
    };

    const handleAuth = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        if (code) {
          await handleOAuthCallback(code);

          return;
        }

        if (isMounted) {
          setIsLoading(true);
        }

        const isAuth = await checkUserAuth();

        if (isMounted) {
          setIsLoading(false);
        }

        const oauthInProgress = sessionStorage.getItem('oauth_in_progress');

        if (!isAuth && oauthInProgress === 'false') {
          await initiateOAuth();
        }
      } catch (error) {
        handleError(error, 'Произошла непредвиденная ошибка при авторизации');

        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Запускаем с явной обработкой ошибок
    handleAuth().catch((error) => {
      console.error('[OAuth Error]: Unhandled promise rejection in useEffect', error);

      if (isMounted) {
        setError('Произошла критическая ошибка при авторизации');
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [location.search, navigate, dispatch]); // Только внешние зависимости

  return {
    isLoading,
    error,
    isAuthenticated,
  };
};
