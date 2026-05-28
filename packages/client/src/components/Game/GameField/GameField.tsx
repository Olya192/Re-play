import React from 'react';
import styles from './GameField.module.css';

interface GameFieldProps {
  children: React.ReactNode;
  onPointerDownCapture?: React.PointerEventHandler<HTMLDivElement>;
  onPointerMove?: React.PointerEventHandler<HTMLDivElement>;
  onPointerUp?: React.PointerEventHandler<HTMLDivElement>;
  onPointerCancel?: React.PointerEventHandler<HTMLDivElement>;
}

export const GameField: React.FC<GameFieldProps> = ({
  children,
  onPointerDownCapture,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}) => {
  return (
    <div
      className={styles.gameField}
      onPointerDownCapture={onPointerDownCapture}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      {children}
    </div>
  );
};
