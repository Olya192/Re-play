import { Helmet } from 'react-helmet';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';

export const LeaderboardPage = () => {
  usePage({ initPage: initLeaderboardPage });

  return (
    <div>
      <Helmet>
        <title>Таблица лидеров</title>
      </Helmet>
      <Header />
      <h1>Лучшие игроки</h1>
      <p>Рейтинг игроков будет здесь</p>
    </div>
  );
};

export const initLeaderboardPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
