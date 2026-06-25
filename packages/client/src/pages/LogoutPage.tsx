import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';
import { useEffect } from 'react';
import { useAuth } from '../hooks/api/useAuth';

export const LogoutPage = () => {
  usePage({ initPage: initLogoutPage });

  const { handleLogout } = useAuth();

  useEffect(() => {
    handleLogout();
  }, []);

  return <div>Выход</div>;
};

export const initLogoutPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
