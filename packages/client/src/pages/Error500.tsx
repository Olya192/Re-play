import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';

export const Error500 = () => {
  usePage({ initPage: initError500 });

  return (
    <div>
      <Helmet>
        <title>Ошибка 500</title>
      </Helmet>
      <Header />
      <h1>500</h1>
      <p>Сервер что-то напутал</p>
    </div>
  );
};

export const initError500 = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
