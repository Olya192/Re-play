export type GamePhase = 'intro' | 'playing' | 'paused' | 'ended';

export interface GameSessionState {
  levelId: string;
  elapsedMs: number;
  score: number;
  caughtCount: number;
  missedCount: number;
  eatenCount: number;
  monsterLength: number;
  phase: GamePhase;
  inventory: Record<string, number>;
  updatedAt: number;
}

export interface SessionSyncPayload {
  elapsedMs?: number;
  score?: number;
  caughtCount?: number;
  missedCount?: number;
  monsterLength?: number;
  inventory?: Record<string, number>;
}
