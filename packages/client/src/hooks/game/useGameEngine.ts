import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clickObject, clickVine, spawnObject } from '../../slices/gameSlice';
import {
  BOMB_CHANCE,
  FOOD_FALL_SPEED,
  FOOD_SPAWN_RATE_MS,
  MUSHROOM_CHANCE,
  POINTS_BOMB_CLICK,
  POINTS_FOOD,
  POINTS_MUSHROOM_CLICK,
  VINE_CUT_INTERVAL_MS,
} from '../../constants/game/gameConstants';
import { generateId, randomRange } from '../../utils/game/gameMath';
import type { RootState } from '../../store';
import type { FallingObject, ObjectType } from '../../types/game/game';

type PointerSnapshot = {
  hitObjectIds: Set<string>;
  isDown: boolean;
  lastVineCutAt: number;
  pendingRelease: boolean;
  clientX: number;
  clientY: number;
  pointerId: number | null;
};

const createPointerSnapshot = (): PointerSnapshot => ({
  hitObjectIds: new Set<string>(),
  isDown: false,
  lastVineCutAt: 0,
  pendingRelease: false,
  clientX: 0,
  clientY: 0,
  pointerId: null,
});

const isUiTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement && Boolean(target.closest('[data-game-ui="true"]'));

const isVineTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement && Boolean(target.closest('[data-game-vine="true"]'));

const getObjectIdFromTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return null;
  }

  return target.closest<HTMLElement>('[data-game-object-id]')?.dataset.gameObjectId ?? null;
};

export const useGameEngine = () => {
  const dispatch = useDispatch();
  const gameStatus = useSelector((state: RootState) => state.game.status);
  const gameStatusRef = useRef(gameStatus);
  const pointerRef = useRef<PointerSnapshot>(createPointerSnapshot());
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    gameStatusRef.current = gameStatus;

    if (gameStatus !== 'playing') {
      pointerRef.current = createPointerSnapshot();
    }
  }, [gameStatus]);

  useEffect(() => {
    const resetPointer = () => {
      pointerRef.current = createPointerSnapshot();
    };

    window.addEventListener('resize', resetPointer);
    window.addEventListener('orientationchange', resetPointer);
    document.addEventListener('visibilitychange', resetPointer);

    return () => {
      window.removeEventListener('resize', resetPointer);
      window.removeEventListener('orientationchange', resetPointer);
      document.removeEventListener('visibilitychange', resetPointer);
    };
  }, []);

  useEffect(() => {
    if (gameStatus !== 'playing') {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }

      return;
    }

    spawnTimerRef.current = setInterval(() => {
      const rand = Math.random();
      let type: ObjectType;
      let points: number;

      if (rand < MUSHROOM_CHANCE) {
        type = 'mushroom';
        points = POINTS_MUSHROOM_CLICK;
      } else if (rand < MUSHROOM_CHANCE + BOMB_CHANCE) {
        type = 'bomb';
        points = POINTS_BOMB_CLICK;
      } else {
        type = 'food';
        points = POINTS_FOOD;
      }

      const newObject: FallingObject = {
        id: generateId(),
        x: randomRange(5, 95),
        y: 0,
        type,
        speed: FOOD_FALL_SPEED,
        points,
      };

      dispatch(spawnObject(newObject));
    }, FOOD_SPAWN_RATE_MS);

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, [dispatch, gameStatus]);

  const updatePointer = (event: React.PointerEvent<HTMLDivElement>, isDown: boolean) => {
    pointerRef.current = {
      ...pointerRef.current,
      isDown,
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
    };
  };

  const processPointerAtCurrentPosition = useCallback(
    (timestamp: number) => {
      const pointer = pointerRef.current;

      if ((!pointer.isDown && !pointer.pendingRelease) || gameStatusRef.current !== 'playing') {
        return;
      }

      const targetAtPoint = document.elementFromPoint(pointer.clientX, pointer.clientY);

      if (
        isVineTarget(targetAtPoint) &&
        timestamp - pointer.lastVineCutAt >= VINE_CUT_INTERVAL_MS
      ) {
        dispatch(clickVine());
        pointerRef.current.lastVineCutAt = timestamp;
      }

      const objectId = getObjectIdFromTarget(targetAtPoint);

      if (objectId && !pointer.hitObjectIds.has(objectId)) {
        pointer.hitObjectIds.add(objectId);
        dispatch(clickObject(objectId));
      }

      if (pointerRef.current.pendingRelease) {
        pointerRef.current = createPointerSnapshot();
      }
    },
    [dispatch]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (gameStatusRef.current !== 'playing') {
        return;
      }

      if (pointerRef.current.pendingRelease) {
        pointerRef.current = createPointerSnapshot();
      }

      if (pointerRef.current.pointerId !== null || isUiTarget(event.target)) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      updatePointer(event, true);
      pointerRef.current.hitObjectIds = new Set<string>();
      pointerRef.current.lastVineCutAt = 0;
      pointerRef.current.pendingRelease = false;
      processPointerAtCurrentPosition(performance.now());
    },
    [processPointerAtCurrentPosition]
  );

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current.pointerId !== null && pointerRef.current.pointerId !== event.pointerId) {
      return;
    }

    updatePointer(event, pointerRef.current.isDown);
  }, []);

  const finishPointer = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerRef.current.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    pointerRef.current = {
      ...pointerRef.current,
      isDown: false,
      pendingRelease: true,
    };
  }, []);

  const processPointerFrame = useCallback(
    (timestamp: number) => {
      processPointerAtCurrentPosition(timestamp);
    },
    [processPointerAtCurrentPosition]
  );

  useEffect(() => {
    return () => {
      pointerRef.current = createPointerSnapshot();
    };
  }, []);

  return {
    handlePointerCancel: finishPointer,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp: finishPointer,
    processPointerFrame,
  };
};
