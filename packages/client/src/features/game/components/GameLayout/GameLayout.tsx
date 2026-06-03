import { CSSProperties, ReactNode } from 'react';
import { useSelector } from '../../../../store';
import { selectLevelMeta } from '../../../../slices/gameSession';
import s from './GameLayout.module.css';

interface GameLayoutProps {
  children: ReactNode;
}

export const GameLayout = ({ children }: GameLayoutProps) => {
  const meta = useSelector(selectLevelMeta);

  const style = {
    '--biome-padding-color': meta.sidePaddingColor,
    '--biome-accent-color': meta.accentColor,
  } as CSSProperties;

  return (
    <div className={s.layout} style={style}>
      {children}
    </div>
  );
};
