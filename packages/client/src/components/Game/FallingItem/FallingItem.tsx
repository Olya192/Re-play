import React from 'react';
import styles from './FallingItem.module.css';
import type { ObjectType } from '../../../types/game/game';

interface FallingItemProps {
  id: string;
  x: number;
  y: number;
  type: ObjectType;
}

export const FallingItem: React.FC<FallingItemProps> = ({ id, x, y, type }) => {
  return (
    <div
      data-game-object-id={id}
      className={`${styles.item} ${styles[type]}`}
      style={{ left: `${x}%`, top: `${y}%` }}
    />
  );
};
