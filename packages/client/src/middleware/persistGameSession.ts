import type { Middleware } from '@reduxjs/toolkit';
import { GameSessionState } from '../slices/gameSession/types';

const STORAGE_KEY = 'replay:gameSession';

const isBrowser = typeof window !== 'undefined';

export const loadPersistedGameSession = (): GameSessionState | undefined => {
  if (!isBrowser) {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return undefined;
    }

    return JSON.parse(raw) as GameSessionState;
  } catch {
    return undefined;
  }
};

const isGameSessionState = (value: unknown): value is GameSessionState => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<GameSessionState>;

  return typeof candidate.levelId === 'string';
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
