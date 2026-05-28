import React from 'react';
import styles from './Vine.module.css';

interface VineProps {
  height: number;
}

export const Vine: React.FC<VineProps> = ({ height }) => {
  return <div data-game-vine="true" className={styles.vine} style={{ height: `${height}%` }} />;
};
