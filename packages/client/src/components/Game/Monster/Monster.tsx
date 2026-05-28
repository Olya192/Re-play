import React from 'react';
import styles from './Monster.module.css';

interface MonsterProps {
  x: number;
  isSleeping: boolean;
  isEating: boolean;
}

export const Monster: React.FC<MonsterProps> = ({ x, isSleeping, isEating }) => {
  return (
    <div
      className={`${styles.monster} ${isSleeping ? styles.sleeping : ''} ${
        isEating ? styles.eating : ''
      }`}
      style={{ left: `${x}%`, bottom: '0%' }}
    >
      <div className={styles.eyes}>
        <div className={styles.eye} />
        <div className={styles.eye} />
      </div>
      <div className={styles.mouth} />
    </div>
  );
};
