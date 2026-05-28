import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { FallingObject, GameState } from '../types/game/game';
import {
  DAY_DURATION_MS,
  MAX_FALL_SPEED_MULTIPLIER,
  MAX_VINE_GROWTH_MULTIPLIER,
  MONSTER_CATCH_RANGE,
  MONSTER_HEIGHT_PERCENT,
  MONSTER_MOUTH_OPEN_RANGE,
  MONSTER_MOVE_SPEED,
  MONSTER_SLEEP_DURATION_MS,
  POINTS_MONSTER_EAT_FOOD,
  VINE_SHRINK_STEP,
  VINE_START_HEIGHT,
} from '../constants/game/gameConstants';

const initialState: GameState = {
  status: 'idle',
  endReason: null,
  score: 0,
  collectedFood: [],
  config: {
    duration: DAY_DURATION_MS,
    spawnRate: 1100,
    vineGrowthRate: 3,
    gravity: 1,
  },
  objects: [],
  monster: {
    isSleeping: false,
    sleepEndTime: 0,
    x: 50,
    isEating: false,
  },
  vine: {
    height: VINE_START_HEIGHT,
    growthRate: 0,
  },
  sun: {
    x: 0,
  },
  elapsedMs: 0,
  lastTick: 0,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetGame: () => initialState,

    startGame: (state) => {
      state.status = 'playing';
      state.endReason = null;
      state.score = 0;
      state.collectedFood = [];
      state.objects = [];
      state.vine.height = VINE_START_HEIGHT;
      state.vine.growthRate = state.config.vineGrowthRate;
      state.sun.x = 0;
      state.monster.isSleeping = false;
      state.monster.sleepEndTime = 0;
      state.monster.x = 50;
      state.monster.isEating = false;
      state.elapsedMs = 0;
      state.lastTick = performance.now();
    },

    gameTick: (state, action: PayloadAction<number>) => {
      const now = action.payload;
      const previousTick = state.lastTick;
      const dt = (now - previousTick) / 1000;
      state.lastTick = now;

      if (state.status !== 'playing') {
        return;
      }

      state.elapsedMs += now - previousTick;
      state.sun.x = (state.elapsedMs / state.config.duration) * 100;

      const progress = Math.min(state.elapsedMs / state.config.duration, 1);

      if (state.sun.x >= 100) {
        state.sun.x = 100;

        if (state.score < 0) {
          state.status = 'gameover';
          state.endReason = 'negativeScore';
        } else {
          state.status = 'victory';
        }

        return;
      }

      const vineSpeedMultiplier = 1 + progress * (MAX_VINE_GROWTH_MULTIPLIER - 1);
      state.vine.height += state.config.vineGrowthRate * vineSpeedMultiplier * dt;

      if (state.vine.height >= 100) {
        state.vine.height = 100;
        state.status = 'gameover';
        state.endReason = 'vine';

        return;
      }

      if (!state.monster.isSleeping && state.objects.length > 0) {
        const target = state.objects.reduce((nearest, obj) => {
          const nearestDistance = Math.abs(nearest.x - state.monster.x);
          const currentDistance = Math.abs(obj.x - state.monster.x);

          return currentDistance < nearestDistance ? obj : nearest;
        });
        const direction = Math.sign(target.x - state.monster.x);
        const nextX = state.monster.x + direction * MONSTER_MOVE_SPEED * dt;

        if ((direction > 0 && nextX > target.x) || (direction < 0 && nextX < target.x)) {
          state.monster.x = target.x;
        } else {
          state.monster.x = Math.min(Math.max(nextX, 5), 95);
        }
      }

      state.objects.forEach((obj) => {
        const fallSpeedMultiplier = 1 + progress * (MAX_FALL_SPEED_MULTIPLIER - 1);
        obj.y += obj.speed * fallSpeedMultiplier * state.config.gravity * dt * 60;
      });

      state.monster.isEating =
        !state.monster.isSleeping &&
        state.objects.some(
          (obj) =>
            Math.abs(obj.x - state.monster.x) <= MONSTER_CATCH_RANGE &&
            obj.y >= 100 - MONSTER_HEIGHT_PERCENT - MONSTER_MOUTH_OPEN_RANGE
        );

      state.objects = state.objects.filter((obj) => {
        if (obj.y >= 100 - MONSTER_HEIGHT_PERCENT) {
          const monsterCanReachObject = Math.abs(obj.x - state.monster.x) <= MONSTER_CATCH_RANGE;

          if (monsterCanReachObject && !state.monster.isSleeping) {
            if (obj.type === 'food') {
              state.score += POINTS_MONSTER_EAT_FOOD;
            } else if (obj.type === 'mushroom') {
              state.monster.isSleeping = true;
              state.monster.sleepEndTime = now + MONSTER_SLEEP_DURATION_MS;
            }

            return false;
          }
        }

        return obj.y < 100;
      });

      if (state.monster.isSleeping && now > state.monster.sleepEndTime) {
        state.monster.isSleeping = false;
      }
    },

    clickObject: (state, action: PayloadAction<string>) => {
      const objId = action.payload;
      const objIndex = state.objects.findIndex((item) => item.id === objId);

      if (objIndex === -1) {
        return;
      }

      const obj = state.objects[objIndex];
      state.score += obj.points;

      if (obj.type === 'food') {
        state.collectedFood.push(obj.type);
      }

      state.objects.splice(objIndex, 1);
    },

    spawnObject: (state, action: PayloadAction<FallingObject>) => {
      state.objects.push(action.payload);
    },

    clickVine: (state) => {
      state.vine.height = Math.max(0, state.vine.height - VINE_SHRINK_STEP);
    },

    pauseGame: (state) => {
      state.status = 'paused';
    },

    resumeGame: (state) => {
      state.status = 'playing';
      state.lastTick = performance.now();
    },
  },
});

export const {
  resetGame,
  startGame,
  gameTick,
  clickObject,
  spawnObject,
  clickVine,
  pauseGame,
  resumeGame,
} = gameSlice.actions;

export default gameSlice.reducer;
