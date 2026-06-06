import { memo, useEffect, useState } from 'react';
import { useSelector } from '../../../../store';
import { selectElapsedMs } from '../../../../slices/gameSession';
import s from './BiomeBackground.module.css';
import { randomInteger } from '../../../../utils/randomeInteger';

const DESSERTS_BACKGROUND = 'url("/biomes/variation/desserts.webp")';
const FRUITS_BACKGROUND = 'url("/biomes/variation/fruits.webp")';
const MOUNTAINS_BACKGROUND = 'url("/biomes/variation/mountains.webp")';
const CLOUDS_BACKGROUND = 'url("/biomes/variation/clouds.webp")';
const SKY_BACKGROUND = 'url("/biomes/variation/sky-v4.webp")';
const WATER_BACKGROUND = 'url("/biomes/variation/water.jpg")';

const backgrounds = [
  DESSERTS_BACKGROUND,
  FRUITS_BACKGROUND,
  MOUNTAINS_BACKGROUND,
  CLOUDS_BACKGROUND,
  SKY_BACKGROUND,
  WATER_BACKGROUND,
];

export const BiomeBackground = memo(() => {
  const elapsedMs = useSelector(selectElapsedMs);
  const [backgroundUrl, setBackgroundUrl] = useState<string>(backgrounds[0]);

  const getBackgroundUrl = (prevUrl: string) => {
    const randomNum = randomInteger(0, backgrounds.length - 1);

    if (prevUrl === backgrounds[randomNum] && backgrounds.length > 1) {
      return getBackgroundUrl(prevUrl);
    }

    return backgrounds[randomNum];
  };

  useEffect(() => {
    if (elapsedMs <= 0) {
      setBackgroundUrl((prev) => {
        const backgroundUrl = getBackgroundUrl(prev);

        return backgroundUrl;
      });
    }
  }, [elapsedMs]);

  if (!backgroundUrl) {
    return null;
  }

  return <div className={s.layer} style={{ backgroundImage: backgroundUrl }} aria-hidden />;
});
