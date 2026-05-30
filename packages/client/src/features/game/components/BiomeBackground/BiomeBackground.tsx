import { CSSProperties } from 'react';
import { useSelector } from '../../../../store';
import { selectLevelMeta } from '../../../../slices/gameSession';
import s from './BiomeBackground.module.css';

export const BiomeBackground = () => {
  const meta = useSelector(selectLevelMeta);

  if (!meta.biomeBackgroundUrl) {
    return null;
  }

  const style: CSSProperties = {
    backgroundImage: `url(${meta.biomeBackgroundUrl})`,
  };

  return <div className={s.layer} style={style} aria-hidden />;
};
