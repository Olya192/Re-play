import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_LEVEL_ID } from '../../features/game/constants/biomes';
import { GamePhase, GameSessionState, SessionSyncPayload } from './types';

export const initialGameSessionState: GameSessionState = {
  levelId: DEFAULT_LEVEL_ID,
  elapsedMs: 0,
  score: 0,
  caughtCount: 0,
  missedCount: 0,
  eatenCount: 0,
  monsterLength: 1,
  // TODO: вернуть 'intro' после подключения StartModal — пока стартуем сразу
  // Это в следующем тикете, который я разделил от этого - делал 3 сразу
  phase: 'playing',
  inventory: {},
  updatedAt: 0,
};

const stamp = (state: GameSessionState) => {
  state.updatedAt = Date.now();
};

export const gameSessionSlice = createSlice({
  name: 'gameSession',
  initialState: initialGameSessionState,
  reducers: {
    setPhase: (state, { payload }: PayloadAction<GamePhase>) => {
      state.phase = payload;
      stamp(state);
    },
    setLevel: (state, { payload }: PayloadAction<string>) => {
      state.levelId = payload;
      state.elapsedMs = 0;
      state.score = 0;
      state.caughtCount = 0;
      state.missedCount = 0;
      state.eatenCount = 0;
      state.monsterLength = 1;
      state.phase = 'intro';
      stamp(state);
    },
    syncFromEngine: (state, { payload }: PayloadAction<SessionSyncPayload>) => {
      if (payload.elapsedMs !== undefined) {
        state.elapsedMs = payload.elapsedMs;
      }

      if (payload.score !== undefined) {
        state.score = payload.score;
      }

      if (payload.caughtCount !== undefined) {
        state.caughtCount = payload.caughtCount;
      }

      if (payload.missedCount !== undefined) {
        state.missedCount = payload.missedCount;
      }

      if (payload.monsterLength !== undefined) {
        state.monsterLength = payload.monsterLength;
      }

      if (payload.inventory !== undefined) {
        state.inventory = payload.inventory;
      }

      stamp(state);
    },
    incrementCaught: (state) => {
      state.caughtCount += 1;
      // TODO: Считать score по формулам, формулы крепить к items
      state.score += 1;
      stamp(state);
    },
    incrementMissed: (state) => {
      state.missedCount += 1;
      stamp(state);
    },
    incrementEaten: (state) => {
      state.eatenCount += 1;
      // TODO: Механика на съеденные предметы (штраф к score, рост монстра и т.д.)
      stamp(state);
    },
    resetSession: () => ({ ...initialGameSessionState, updatedAt: Date.now() }),
    hydrateSession: (_state, { payload }: PayloadAction<GameSessionState>) => payload,
  },
});

export const {
  setPhase,
  setLevel,
  syncFromEngine,
  incrementCaught,
  incrementMissed,
  incrementEaten,
  resetSession,
  hydrateSession,
} = gameSessionSlice.actions;

export default gameSessionSlice.reducer;
