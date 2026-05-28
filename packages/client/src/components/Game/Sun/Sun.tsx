import React from 'react';
import styles from './Sun.module.css';

interface SunProps {
  x: number;
  y?: number;
}

export const Sun: React.FC<SunProps> = ({ x, y = 10 }) => {
  return <div className={styles.sun} style={{ left: `${x}%`, top: `${y}%` }} />;
};
