export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover' | 'victory';

export type GameEndReason = 'vine' | 'negativeScore' | null;

export type ObjectType = 'food' | 'mushroom' | 'bomb';

export interface FallingObject {
  id: string;
  x: number;
  y: number;
  type: ObjectType;
  speed: number;
  points: number;
}

export interface Monster {
  isSleeping: boolean;
  sleepEndTime: number;
  x: number;
  isEating: boolean;
}

export interface Vine {
  height: number;
  growthRate: number;
}

export interface Sun {
  x: number;
  y?: number;
  dayProgress?: number;
}

export interface GameState {
  status: GameStatus;
  endReason: GameEndReason;
  score: number;
  collectedFood: ObjectType[];
  config: {
    duration: number;
    spawnRate: number;
    vineGrowthRate: number;
    gravity: number;
  };
  objects: FallingObject[];
  monster: Monster;
  vine: Vine;
  sun: Sun;
  elapsedMs: number;
  lastTick: number;
}
