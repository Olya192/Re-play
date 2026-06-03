import type { Middleware } from '@reduxjs/toolkit';
import { GamePhase, GameSessionState } from '../slices/gameSession/types';

const STORAGE_KEY = 'replay:gameSession';

const isBrowser = typeof window !== 'undefined';

const GAME_PHASES: readonly GamePhase[] = ['intro', 'playing', 'paused', 'ended'];

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isInventory = (value: unknown): value is GameSessionState['inventory'] =>
  isPlainObject(value) && Object.values(value).every((amount) => typeof amount === 'number');

const isGameSessionState = (value: unknown): value is GameSessionState => {
  if (!isPlainObject(value)) {
    return false;
  }

  return (
    typeof value.levelId === 'string' &&
    typeof value.elapsedMs === 'number' &&
    typeof value.score === 'number' &&
    typeof value.caughtCount === 'number' &&
    typeof value.missedCount === 'number' &&
    typeof value.eatenCount === 'number' &&
    typeof value.monsterLength === 'number' &&
    typeof value.updatedAt === 'number' &&
    GAME_PHASES.includes(value.phase as GamePhase) &&
    isInventory(value.inventory)
  );
};

export const loadPersistedGameSession = (): GameSessionState | undefined => {
  if (!isBrowser) {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return undefined;
    }

    const parsed: unknown = JSON.parse(raw);

    return isGameSessionState(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

export const persistGameSessionMiddleware: Middleware = (storeApi) => {
  let lastSerialized: string | null = null;

  return (next) => (action) => {
    const result = next(action);

    if (!isBrowser) {
      return result;
    }

    const state = storeApi.getState();
    const session = (state as { gameSession?: unknown }).gameSession;

    if (!isGameSessionState(session)) {
      return result;
    }

    try {
      const serialized = JSON.stringify(session);

      if (serialized !== lastSerialized) {
        lastSerialized = serialized;
        window.localStorage.setItem(STORAGE_KEY, serialized);
      }
    } catch {
      // молча игнорим
    }

    return result;
  };
};
