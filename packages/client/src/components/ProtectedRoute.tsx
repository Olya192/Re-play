import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchUserThunk, selectUser } from '../slices/userSlice';
import { useDispatch, useSelector } from '../store';

export const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  // Если пользователь уже в сторе (напр. после клиентской навигации) — считаем
  // авторизованным сразу, без лишней проверки и мигания лоадером.
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(user ? true : null);

  useEffect(() => {
    let cancelled = false;

    // Пользователя тянем на клиенте: кука авторизации принадлежит домену
    // ya-praktikum.tech (third-party) и на наш SSR не приходит, поэтому
    // серверный префетч пользователя невозможен до появления собственного
    // бэкенд-прокси (запланировано на 9 спринт) - возможно сделаю раньше, задолбался проверять на старом firefox
    dispatch(fetchUserThunk())
      .unwrap()
      .then(() => {
        if (!cancelled) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsAuthenticated(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (isAuthenticated === null) {
    return <div>Проверка авторизации...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
