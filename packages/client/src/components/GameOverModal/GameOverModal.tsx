import React from 'react';
import { Modal, Button } from 'antd';
import styles from './GameOverModal.module.css';

interface GameOverModalProps {
  open: boolean;
  score?: number;
  bestScore?: number;
  onRetry: () => void;
  onBackToMenu: () => void;
}

export const GameOverModal = ({
  open,
  score,
  bestScore,
  onRetry,
  onBackToMenu,
}: GameOverModalProps) => {
  return (
    <Modal open={open} footer={null} closable={false} centered width={420} className={styles.modal}>
      <div className={styles.container}>
        <h2 className={styles.title}>Игра завершена</h2>

        <p className={styles.description}>
          Отличная попытка! Можно попробовать ещё раз или вернуться в главное меню.
        </p>

        <div className={styles.scoreBlock}>
          <div className={styles.scoreItem}>
            <span className={styles.scoreLabel}>Ваш счёт</span>
            <span className={styles.scoreValue}>{score ?? '—'}</span>
          </div>

          <div className={styles.scoreItem}>
            <span className={styles.scoreLabel}>Лучший счёт</span>
            <span className={styles.scoreValue}>{bestScore ?? '—'}</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="primary" size="large" block onClick={onRetry}>
            Повторить
          </Button>

          <Button size="large" block onClick={onBackToMenu}>
            Вернуться в главное меню
          </Button>
        </div>
      </div>
    </Modal>
  );
};
