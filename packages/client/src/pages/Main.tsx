import { Helmet } from 'react-helmet-async';
import { useSelector } from '@/store';
import { selectUser } from '@/slices/userSlice';
import { Header } from '@/components/Header';
import { usePage } from '@/hooks';

export const MainPage = () => {
  const user = useSelector(selectUser);

  usePage({ initPage: initMainPage });

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Главная</title>
        <meta name="description" content="Главная страница с информацией о пользователе" />
      </Helmet>
      <Header />
      <h1>Удалить - в ней нет смысла. Главная страница - это игра.</h1>
      <h2>Но можно использовать помоечку для тестов.</h2>
      {user ? (
        <div>
          <p>{user.firstName}</p>
          <p>{user.secondName}</p>
        </div>
      ) : (
        <p>Пользователь не найден!</p>
      )}
    </div>
  );
};

// Пользователь грузится централизованно в ProtectedRoute (клиентская кука),
// серверный префетч пользователя невозможен — см. комментарий там
export const initMainPage = () => Promise.resolve();
