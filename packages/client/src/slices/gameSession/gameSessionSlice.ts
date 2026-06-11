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
  phase: 'intro',
  inventory: {},
  updatedAt: 0,
};

// TODO Refactor for tests: убрать Date.now() из редьюсера, а то результат зависит от текущего времени
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
    startLevel: (state, { payload }: PayloadAction<string>) => {
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
    incrementCaught: (state, { payload }: PayloadAction<number | undefined>) => {
      const count = payload ?? 1;
      state.caughtCount += count;
      // TODO: Считать score по формулам, формулы крепить к items
      state.score += count;
      stamp(state);
    },
    incrementMissed: (state, { payload }: PayloadAction<number | undefined>) => {
      state.missedCount += payload ?? 1;
      stamp(state);
    },
    incrementEaten: (state, { payload }: PayloadAction<number | undefined>) => {
      state.eatenCount += payload ?? 1;
      // TODO: Механика на съеденные предметы (штраф к score, рост монстра и т.д.)
      stamp(state);
    },
    resetSession: () => ({ ...initialGameSessionState, updatedAt: Date.now() }),
    hydrateSession: (_state, { payload }: PayloadAction<GameSessionState>) => payload,
  },
});

export const {
  setPhase,
  startLevel,
  syncFromEngine,
  incrementCaught,
  incrementMissed,
  incrementEaten,
  resetSession,
  hydrateSession,
} = gameSessionSlice.actions;

export default gameSessionSlice.reducer;
