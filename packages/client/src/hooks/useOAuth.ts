import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../api/authApi';
import { setUser, clearUser } from '../slices/userSlice';

export const useOAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const handleError = (error: unknown, defaultMessage: string) => {
      const errorMessage = error instanceof Error ? error.message : defaultMessage;
      console.error(`[OAuth Error]: ${errorMessage}`, error);

      if (isMounted) {
        setError(errorMessage);
      }
    };

    const handleOAuthCallback = async (code: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const redirectUri = window.location.origin;

        console.log('1. Обмениваем код на токен через ваш сервер...');
        await authApi.exchangeCodeForToken(code, redirectUri);

        console.log('2. Получаем пользователя с вашего сервера...');
        const user = await authApi.getCurrentUser();

        if (user && isMounted) {
          console.log('3. Пользователь авторизован:', user);
          dispatch(setUser(user));
          setIsAuthenticated(true);
          sessionStorage.removeItem('oauth_in_progress');
          navigate('/');
        } else {
          throw new Error('Не удалось получить данные пользователя');
        }
      } catch (error) {
        handleError(error, 'Не удалось завершить авторизацию');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const checkAuth = async () => {
      try {
        console.log('Проверка авторизации на сервере...');
        const user = await authApi.getCurrentUser();

        if (user && isMounted) {
          console.log('Пользователь авторизован:', user);
          dispatch(setUser(user));
          setIsAuthenticated(true);

          return true;
        } else {
          console.log('Пользователь не авторизован');

          if (isMounted) {
            dispatch(clearUser());
            setIsAuthenticated(false);
          }

          return false;
        }
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);

        if (isMounted) {
          setIsAuthenticated(false);
          dispatch(clearUser());
        }

        return false;
      }
    };

    const initiateOAuth = async () => {
      try {
        console.log('Инициализация OAuth...');
        const redirectUri = window.location.origin;
        const clientId = await authApi.getServiceID(redirectUri);

        console.log('Client ID получен:', clientId);

        const yandexAuthUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}`;

        sessionStorage.setItem('oauth_in_progress', 'true');
        window.location.assign(yandexAuthUrl);
      } catch (error) {
        handleError(error, 'Не удалось инициировать авторизацию');
        setIsLoading(false);
      }
    };

    const handleAuth = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (code) {
        console.log('Найден код в URL, обрабатываем колбэк...');
        await handleOAuthCallback(code);

        return;
      }

      setIsLoading(true);
      const isAuth = await checkAuth();
      setIsLoading(false);

      const oauthInProgress = sessionStorage.getItem('oauth_in_progress');

      if (!isAuth && oauthInProgress !== 'true') {
        console.log('Пользователь не авторизован, редирект на Яндекс...');
        await initiateOAuth();
      }
    };

    handleAuth().catch((error) => {
      console.error('[OAuth Error]:', error);

      if (isMounted) {
        setError('Критическая ошибка');
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [location.search, navigate, dispatch]);

  return { isLoading, error, isAuthenticated };
};
