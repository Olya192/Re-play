import { ReactNode } from 'react';
import s from './GameStage.module.css';

interface GameStageProps {
  children: ReactNode;
}

export const GameStage = ({ children }: GameStageProps) => {
  return (
    <div className={s.stage} role="main">
      {children}
    </div>
  );
};
