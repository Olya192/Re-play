export interface BiomeMeta {
  id: string;
  planet: string;
  biome: string;
  biomeIndex: number;
  totalBiomes: number;
  durationMs: number;
  sidePaddingColor: string;
  accentColor: string;
  biomeBackgroundUrl: string | null;
  rotatingBackgroundUrl: string | null;
}

export const EARTH_FOREST_ID = 'earth/forest';

export const DEFAULT_LEVEL_ID = EARTH_FOREST_ID;

// TODO брать из базы
export const BIOME_META: Record<string, BiomeMeta> = {
  [EARTH_FOREST_ID]: {
    id: EARTH_FOREST_ID,
    planet: 'Земля',
    biome: 'Лес',
    biomeIndex: 1,
    totalBiomes: 5,
    durationMs: 33_000,
    sidePaddingColor: '#1f3a1f',
    accentColor: '#67c267',
    biomeBackgroundUrl: '/biomes/earth/forest/biome.png',
    rotatingBackgroundUrl: '/biomes/earth/forest/sky.png',
  },
};

export const getBiomeMeta = (id: string): BiomeMeta =>
  BIOME_META[id] ?? BIOME_META[DEFAULT_LEVEL_ID];
