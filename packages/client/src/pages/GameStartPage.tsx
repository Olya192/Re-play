import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';
import { GameOverModal } from '../components/GameOverModal';
import { useState } from 'react';

export const GameStartPage = () => {
  usePage({ initPage: initGameStartPage });
  const [isGameOver, setIsGameOver] = useState(false);

  return (
    <div>
      <Helmet>
        <title>Начало игры</title>
      </Helmet>
      <Header />
      <h1>Готов?</h1>
      <p>Нажми кнопку, чтобы начать</p>
      <button style={{ padding: '10px 20px', fontSize: '18px' }}>Начать</button>
      <button
        style={{ padding: '10px 20px', fontSize: '18px' }}
        onClick={() => setIsGameOver(true)}
      >
        Показать модалку завершения
      </button>

      <GameOverModal
        open={isGameOver}
        score={100}
        bestScore={200}
        onRetry={() => {
          setIsGameOver(false);
        }}
        onBackToMenu={() => {
          setIsGameOver(false);
        }}
      />
    </div>
  );
};

export const initGameStartPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
