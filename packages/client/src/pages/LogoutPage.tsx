import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';
import { useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/api/useAuth';
import { checkAuth } from '../api/checkAuth';
import { useNavigate } from 'react-router-dom';

export const LogoutPage = () => {
  usePage({ initPage: initLogoutPage });

  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  const isUserAuth = useMemo(async () => {
    return await checkAuth();
  }, []);

  useEffect(() => {
    if (isUserAuth) {
      handleLogout();
    } else {
      navigate('/');
    }
  }, []);

  return <div>Выход</div>;
};

export const initLogoutPage = async ({ _dispatch, _state }: PageInitArgs) => {
  // заглушка
};
