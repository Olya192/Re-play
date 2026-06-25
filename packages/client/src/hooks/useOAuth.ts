import { useEffect, useState } from 'react';
import { checkAuth } from '../api/checkAuth';
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

  // Получение текущего URL для redirect_uri
  const getRedirectUri = (): string => {
    const currentUrl = window.location.origin + window.location.pathname;
    const cleanUrl = currentUrl.split('?')[0];

    return window.location.origin;
  };

  // Запуск OAuth процесса
  const initiateOAuth = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const redirectUri = window.location.origin;
      console.log('🔐 Redirect URI:', redirectUri);

      const clientId = await authApi.getServiceID(redirectUri);

      console.log('📝 Client ID:', clientId);

      // Редирект на Яндекс
      const yandexAuthUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;

      sessionStorage.setItem('oauth_in_progress', 'true');
      sessionStorage.setItem('oauth_redirect_uri', redirectUri);

      window.location.href = yandexAuthUrl;
    } catch (error) {
      console.error('OAuth initiation failed:', error);
      setError('Не удалось инициировать авторизацию через Яндекс');
      setIsLoading(false);
    }
  };

  // Обработка OAuth callback
  const handleOAuthCallback = async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const redirectUri = sessionStorage.getItem('oauth_redirect_uri') || getRedirectUri();

      // Обмениваем code на токен
      await authApi.exchangeCodeForToken(code, redirectUri);

      // Получаем данные пользователя
      const user = await authApi.getCurrentUser();

      if (user) {
        dispatch(setUser(user));
        setIsAuthenticated(true);
        sessionStorage.removeItem('oauth_in_progress');
        sessionStorage.removeItem('oauth_redirect_uri');

        // Перенаправляем на главную
        navigate('/');
      } else {
        throw new Error('Не удалось получить данные пользователя');
      }
    } catch (error) {
      console.error(' OAuth callback failed:', error);
      setError('Не удалось завершить авторизацию через Яндекс');
      sessionStorage.removeItem('oauth_in_progress');
      sessionStorage.removeItem('oauth_redirect_uri');
    } finally {
      setIsLoading(false);
    }
  };

  // Проверка авторизации
  const checkUserAuth = async () => {
    try {
      const isAuth = await checkAuth();
      setIsAuthenticated(isAuth);

      return isAuth;
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);

      return false;
    }
  };

  // Главный эффект
  useEffect(() => {
    const handleAuth = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get('code');

      if (code) {
        console.log('🔑 Найден code в URL:', code);
        await handleOAuthCallback(code);

        return;
      }

      // Проверяем авторизацию
      setIsLoading(true);
      const isAuth = await checkUserAuth();
      setIsLoading(false);

      // Если не авторизованы и OAuth не в процессе - запускаем OAuth
      const oauthInProgress = sessionStorage.getItem('oauth_in_progress');

      if (!isAuth && !oauthInProgress) {
        console.log('Пользователь не авторизован, запуск OAuth...');
        await initiateOAuth();
      }
    };

    handleAuth();
  }, [location.search]);

  return {
    isLoading,
    error,
    isAuthenticated,
  };
};
