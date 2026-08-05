import { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from '../store';
import {
  setPageHasBeenInitializedOnServer,
  selectPageHasBeenInitializedOnServer,
} from '../slices/ssrSlice';
import { PageInitArgs, PageInitContext } from '../routes';
import { useOAuth } from './useOAuth';
import { userApi } from '@/api/userApi';
import { authApi } from '@/api/authApi';
import { setUser } from '../slices/userSlice';

const getCookie = (name: string) => {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );

  return matches ? decodeURIComponent(matches[1]) : undefined;
};

const createContext = (): PageInitContext => ({
  clientToken: getCookie('token'),
});

type PageProps = {
  initPage: (data: PageInitArgs) => Promise<unknown>;
};

export const usePage = ({ initPage }: PageProps) => {
  const dispatch = useDispatch();
  const pageHasBeenInitializedOnServer = useSelector(selectPageHasBeenInitializedOnServer);
  const store = useStore();
  const [isPageInitialized, setIsPageInitialized] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Хук для OAuth обработки (без проверки авторизации)
  const {
    isLoading: isOAuthLoading,
    error: oAuthError,
    isAuthenticated: isOAuthAuthenticated,
  } = useOAuth();

  // Основная проверка авторизации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Проверяем, есть ли пользователь в store
        const currentUser = store.getState().user.data;

        if (currentUser) {
          setIsAuthenticated(true);
          setIsAuthChecked(true);

          return;
        }

        // Проверяем авторизацию через API
        try {
          const user = await authApi.getCurrentUser();

          if (user) {
            dispatch(setUser(user));
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          // 401 - просто неавторизован
          console.log('User not authenticated');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, [dispatch, store]);

  // Инициализация страницы
  useEffect(() => {
    initializePage();
  }, []); // Пустой массив зависимостей - запускается сразу при монтировании

  // Обработка OAuth после инициализации страницы
  useEffect(() => {
    if (isOAuthLoading || !isOAuthAuthenticated || !isPageInitialized) {
      return;
    }

    // Дополнительные действия после OAuth
    const user = store.getState().user.data;

    if (user) {
      const { id, login, displayName } = user;
      userApi.createOrUpdateUser({ yaId: id, login, displayName });
      setIsAuthenticated(true);
    }
  }, [isOAuthLoading, isOAuthAuthenticated, isPageInitialized, store]);

  const initializePage = async () => {
    if (isPageInitialized) {
      setIsPageLoading(false);

      return;
    }

    try {
      setIsPageLoading(true);

      if (pageHasBeenInitializedOnServer) {
        dispatch(setPageHasBeenInitializedOnServer(false));
        setIsPageInitialized(true);
        setIsPageLoading(false);

        return;
      }

      await initPage({
        dispatch,
        state: store.getState(),
        ctx: createContext(),
      });
      setIsPageInitialized(true);
      setIsPageLoading(false);
    } catch (error) {
      console.error('Page initialization failed:', error);
      setIsPageLoading(false);
    }
  };

  const isLoading = isPageLoading || isOAuthLoading || !isAuthChecked;

  return {
    isLoading,
    error: oAuthError,
    isAuthenticated: isAuthenticated || isOAuthAuthenticated,
    isPageInitialized,
  };
};
