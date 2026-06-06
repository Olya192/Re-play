import { ReactNode } from 'react';
import s from './GameLayout.module.css';

interface GameLayoutProps {
  children: ReactNode;
}

export const GameLayout = ({ children }: GameLayoutProps) => {
  return <div className={s.layout}>{children}</div>;
};
