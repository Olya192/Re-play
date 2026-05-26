import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';

export const Error404 = () => {
  usePage({ initPage: initError404 });

  return (
    <div>
      <Helmet>
        <title>Ошибка 404</title>
      </Helmet>
      <Header />
      <h1>404</h1>
      <p>Не туда попали</p>
    </div>
  );
};

export const initError404 = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
