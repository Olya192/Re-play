jest.mock('../../../../../api/themeApi', () => ({
  fetchThemes: jest.fn().mockResolvedValue([]),
  fetchUserTheme: jest.fn().mockResolvedValue(null),
  setUserTheme: jest.fn().mockResolvedValue({ theme: { id: 1, theme: 'light', name: 'Light' } }),
}));

import {
  ITEM_SIZE_RATIO,
  computeItemLeft,
  computeItemTop,
  getItemSize,
} from './GamePlayPlaceholder';

const stage = { width: 600, height: 800 };

describe('getItemSize', () => {
  it('использует sizeRatio предмета, если он задан', () => {
    const item = { id: 1, foodId: 1, kind: 'shard' as const, xPx: 0, spawnedAt: 0, sizeRatio: 0.5 };

    expect(getItemSize(item, stage)).toBe(300);
  });

  it('падает на дефолтный ITEM_SIZE_RATIO, если sizeRatio нет', () => {
    const item = { id: 1, foodId: 1, kind: 'edible' as const, xPx: 0, spawnedAt: 0 };

    expect(getItemSize(item, stage)).toBe(stage.width * ITEM_SIZE_RATIO);
  });
});

describe('computeItemTop', () => {
  const item = {
    id: 1,
    foodId: 1,
    kind: 'edible' as const,
    xPx: 0,
    spawnedAt: 1000,
    fallDurationMs: 1000,
  };

  it('в момент спавна предмет находится над сценой (-itemSize)', () => {
    expect(computeItemTop(item, 1000, stage, 100)).toBe(-100);
  });

  it('в конце падения предмет у нижней границы сцены', () => {
    expect(computeItemTop(item, 2000, stage, 100)).toBe(800);
  });

  it('на половине пути — середина траектории', () => {
    expect(computeItemTop(item, 1500, stage, 100)).toBe(350);
  });
});

describe('computeItemLeft', () => {
  it('без горизонтальной скорости возвращает исходный x', () => {
    const item = { id: 1, foodId: 1, kind: 'edible' as const, xPx: 200, spawnedAt: 0 };

    expect(computeItemLeft(item, 0, stage, 100)).toBe(200);
  });

  it('сдвигает по горизонтали со скоростью vxPxPerSec', () => {
    const item = {
      id: 1,
      foodId: 1,
      kind: 'shard' as const,
      xPx: 200,
      spawnedAt: 0,
      vxPxPerSec: 100,
    };

    expect(computeItemLeft(item, 2000, stage, 100)).toBe(400);
  });

  it('зажимает по правому краю (stage.width - itemSize)', () => {
    const item = {
      id: 1,
      foodId: 1,
      kind: 'shard' as const,
      xPx: 200,
      spawnedAt: 0,
      vxPxPerSec: 100,
    };

    expect(computeItemLeft(item, 5000, stage, 100)).toBe(500);
  });

  it('зажимает по левому краю (0)', () => {
    const item = {
      id: 1,
      foodId: 1,
      kind: 'shard' as const,
      xPx: 100,
      spawnedAt: 0,
      vxPxPerSec: -100,
    };

    expect(computeItemLeft(item, 3000, stage, 100)).toBe(0);
  });
});
