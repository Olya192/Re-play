import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';

export const UserProfile = () => {
  usePage({ initPage: initUserProfile });

  return (
    <div>
      <Helmet>
        <title>Профиль пользователя</title>
      </Helmet>
      <Header />
      <h1>Мой профиль</h1>
      <p>Здесь настройки и инвентарь игрока</p>
    </div>
  );
};

export const initUserProfile = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
