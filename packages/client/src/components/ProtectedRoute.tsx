import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchUserThunk, selectUser, selectUserStatus } from '../slices/userSlice';
import { useDispatch, useSelector } from '../store';

export const ProtectedRoute = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const status = useSelector(selectUserStatus);

  useEffect(() => {
    // Пользователя тянем на клиенте: кука авторизации принадлежит домену
    // ya-praktikum.tech (third-party) и на наш SSR не приходит, поэтому
    // серверный префетч пользователя невозможен до появления собственного
    // бэкенд-прокси (запланировано на 9 спринт) - возможно сделаю раньше, задолбался проверять на старом firefox
    // Повтор запроса при наличии пользователя отсекается condition в самом thunk.
    const promise = dispatch(fetchUserThunk());

    // Отменяем реальный запрос при размонтировании (signal доходит до fetch).
    return () => {
      promise.abort();
    };
  }, [dispatch]);

  if (status === 'idle' || status === 'loading') {
    return <div>Проверка авторизации...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
