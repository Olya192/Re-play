import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';

export const GameStartPage = () => {
  usePage({ initPage: initGameStartPage });

  return (
    <div>
      <Helmet>
        <title>Начало игры</title>
      </Helmet>
      <Header />
      <h1>Готов?</h1>
      <p>Нажми кнопку, чтобы начать</p>
      <button style={{ padding: '10px 20px', fontSize: '18px' }}>Начать</button>
    </div>
  );
};

export const initGameStartPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
