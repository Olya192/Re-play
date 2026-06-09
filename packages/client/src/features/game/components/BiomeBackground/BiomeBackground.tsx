import { memo, useEffect, useLayoutEffect, useState } from 'react';
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
  const [backgroundUrl, setBackgroundUrl] = useState<string>('');

  const getBackgroundUrl = (prevUrl: string) => {
    if (backgrounds.length === 0) {
      return '';
    }

    if (backgrounds.length === 1) {
      return backgrounds[0];
    }

    let randomNum;

    do {
      randomNum = randomInteger(0, backgrounds.length - 1);
    } while (backgrounds[randomNum] === prevUrl);

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

  useLayoutEffect(() => {
    const randomNum = randomInteger(0, backgrounds.length - 1);
    setBackgroundUrl(backgrounds[randomNum]);
  }, []);

  return <div className={s.layer} style={{ backgroundImage: backgroundUrl }} aria-hidden />;
});
