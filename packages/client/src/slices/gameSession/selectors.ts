import { RootState } from '../../store';
import { getBiomeMeta } from '../../features/game/constants/biomes';

export const selectGameSession = (state: RootState) => state.gameSession;

export const selectPhase = (state: RootState) => state.gameSession.phase;

export const selectLevelId = (state: RootState) => state.gameSession.levelId;

export const selectElapsedMs = (state: RootState) => state.gameSession.elapsedMs;

export const selectScore = (state: RootState) => state.gameSession.score;

export const selectCaughtCount = (state: RootState) => state.gameSession.caughtCount;

export const selectMissedCount = (state: RootState) => state.gameSession.missedCount;

export const selectEatenCount = (state: RootState) => state.gameSession.eatenCount;

export const selectMonsterLength = (state: RootState) => state.gameSession.monsterLength;

export const selectInventory = (state: RootState) => state.gameSession.inventory;

export const selectLevelMeta = (state: RootState) => getBiomeMeta(state.gameSession.levelId);
