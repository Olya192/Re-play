// hooks/useOAuth.ts
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authApi } from '../api/authApi';
import { setUser } from '../slices/userSlice';
import { checkAuth, getCurrentUser } from '@/api/checkAuth';
import { computeClosable } from 'antd/es/_util/hooks';

// export const useOAuth = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const handleAuth = async () => {
//       const searchParams = new URLSearchParams(location.search);
//       const code = searchParams.get('code');
//       const errorParam = searchParams.get('error');

//       // 1. Ошибка от Яндекса
//       if (errorParam) {
//         setError('Ошибка авторизации через Яндекс');
//         setIsLoading(false);

//         return;
//       }

//       // 2. Есть code - обрабатываем OAuth колбэк
//       if (code) {
//         try {
//           setIsLoading(true);
//           setError(null);

//           const redirectUri = window.location.origin;

//           // ✅ Единственный запрос к серверу
//           const user = await authApi.loginWithYandex(code, redirectUri);

//           if (user) {
//             console.log('✅ Пользователь авторизован:', user);
//             dispatch(setUser(user));

//             // Очищаем URL от code
//             window.history.replaceState({}, '', window.location.pathname);

//             navigate('/');
//           } else {
//             throw new Error('Не удалось получить данные пользователя');
//           }
//         } catch (error) {
//           const message = error instanceof Error ? error.message : 'Ошибка авторизации';
//           setError(message);
//         } finally {
//           setIsLoading(false);
//         }

//         return;
//       }

//       // 3. Нет code - проверяем авторизацию
//       try {
//         setIsLoading(true);
//         const user = await authApi.getCurrentUser();

//         if (user) {
//           console.log('✅ Пользователь уже авторизован');
//           dispatch(setUser(user));
//         }
//       } catch (error) {
//         console.log('ℹ️ Пользователь не авторизован');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     handleAuth();
//   }, [location.search, navigate, dispatch]);

//   // Функция запуска OAuth
//   const startOAuth = async () => {
//     try {
//       setError(null);
//       const redirectUri = window.location.origin;

//       // Получаем service_id напрямую
//       const clientId = await authApi.getServiceID(redirectUri);

//       // Редирект на Яндекс
//       const yandexAuthUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;

//       console.log('🔄 Редирект на Яндекс:', yandexAuthUrl);
//       window.location.assign(yandexAuthUrl);
//     } catch (error) {
//       const message = error instanceof Error ? error.message : 'Ошибка запуска авторизации';
//       setError(message);
//     }
//   };

//   return { isLoading, error, startOAuth };
// };

export const useOAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    console.log('useEffect useOAuth');
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

        const data = await authApi.loginWithYandex(code, redirectUri);
        console.log('data', data);
        await authApi.checkSession();
        const user = await authApi.getCurrentUser();
        console.log('user data', user);

        if (user) {
          dispatch(setUser(user));

          if (isMounted) {
            setIsAuthenticated(true);
          }

          sessionStorage.removeItem('oauth_in_progress');
          sessionStorage.removeItem('oauth_redirect_uri');

          // Очищаем URL от code
          window.history.replaceState({}, '', window.location.pathname);

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
        }

        return isAuth;
      } catch (error) {
        console.error(`[OAuth Error]: Auth check failed`, error);

        if (isMounted) {
          setIsAuthenticated(false);
        }

        return false;
      }
    };

    const handleAuth = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        // Если есть code - обрабатываем OAuth callback
        if (code) {
          await handleOAuthCallback(code);

          return;
        }

        // Проверяем авторизацию
        if (isMounted) {
          setIsLoading(true);
        }

        const isAuth = await checkUserAuth();

        if (isMounted) {
          setIsLoading(false);
        }

        // Запускаем OAuth только если пользователь НЕ авторизован
        // и НЕТ признака, что мы уже в процессе OAuth
        const oauthInProgress = sessionStorage.getItem('oauth_in_progress');

        if (!isAuth && oauthInProgress !== 'true') {
          // Устанавливаем флаг, чтобы предотвратить повторный запуск
          sessionStorage.setItem('oauth_in_progress', 'pending');
          await initiateOAuth();
        } else if (oauthInProgress === 'true') {
          // Если OAuth в процессе, но пользователь вернулся без code
          // очищаем флаг и не запускаем заново
          sessionStorage.removeItem('oauth_in_progress');
          sessionStorage.removeItem('oauth_redirect_uri');
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
  }, []);

  return {
    isLoading,
    error,
    isAuthenticated,
  };
};
