import { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from '../store';
import {
  setPageHasBeenInitializedOnServer,
  selectPageHasBeenInitializedOnServer,
} from '../slices/ssrSlice';
import { PageInitArgs, PageInitContext } from '../routes';
import { useOAuth } from './useOAuth';
import { setUser } from '@/slices/userSlice';

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

  const { isLoading: isOAuthLoading, error: oAuthError, isAuthenticated } = useOAuth();

  useEffect(() => {
    if (isOAuthLoading) {
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    // dispatch(setUser(user));

    initializePage();
  }, [isOAuthLoading, isAuthenticated]);

  const initializePage = async () => {
    if (isPageInitialized) {
      return;
    }

    try {
      if (pageHasBeenInitializedOnServer) {
        dispatch(setPageHasBeenInitializedOnServer(false));
        setIsPageInitialized(true);

        return;
      }

      await initPage({
        dispatch,
        state: store.getState(),
        ctx: createContext(),
      });
      setIsPageInitialized(true);
    } catch (error) {
      console.error('Page initialization failed:', error);
    }
  };

  return {
    isLoading: isOAuthLoading,
    error: oAuthError,
    isAuthenticated,
    isPageInitialized,
  };
};
