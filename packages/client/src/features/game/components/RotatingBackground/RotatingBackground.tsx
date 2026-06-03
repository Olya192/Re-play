import { CSSProperties } from 'react';
import { useSelector } from '../../../../store';
import { selectElapsedMs, selectLevelMeta } from '../../../../slices/gameSession';
import s from './RotatingBackground.module.css';

const PROGRESS_ARC_DEG = 180;

export const RotatingBackground = () => {
  const meta = useSelector(selectLevelMeta);
  const elapsedMs = useSelector(selectElapsedMs);

  const progress = Math.min(1, Math.max(0, elapsedMs / meta.durationMs));
  const rotateDeg = -90 + progress * PROGRESS_ARC_DEG;

  const style = {
    '--rotate-deg': `${rotateDeg}deg`,
    backgroundImage: meta.rotatingBackgroundUrl ? `url(${meta.rotatingBackgroundUrl})` : undefined,
  } as CSSProperties;

  return (
    <div className={s.discWrap} aria-hidden>
      <div className={s.disc} style={style} />
    </div>
  );
};
