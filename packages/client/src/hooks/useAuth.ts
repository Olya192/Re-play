// hooks/useAuth.ts - только проверка авторизации
import { useEffect, useState } from 'react';
import { authApi } from '../api/authApi';
import { setUser } from '../slices/userSlice';
import { useDispatch, useSelector } from '../store';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.data);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      // Если пользователь уже есть в store
      if (user) {
        setIsAuthenticated(true);
        setIsLoading(false);

        return;
      }

      try {
        const currentUser = await authApi.getCurrentUser();

        if (isMounted) {
          if (currentUser) {
            dispatch(setUser(currentUser));
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }

          setIsLoading(false);
        }
      } catch (error) {
        // 401 - просто неавторизован
        if (isMounted) {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [user, dispatch]);

  return { isLoading, isAuthenticated };
};
