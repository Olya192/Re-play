import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';

export const ForumPage = () => {
  usePage({ initPage: initForumPage });

  return (
    <div>
      <Helmet>
        <title>Форум</title>
      </Helmet>
      <Header />
      <h1>Форум игры</h1>
      <p>Список тем и обсуждений</p>
    </div>
  );
};

export const initForumPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
