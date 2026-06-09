import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from '../../../../../store';
import {
  incrementCaught,
  incrementEaten,
  incrementMissed,
  selectLevelMeta,
  selectPhase,
  setPhase,
  syncFromEngine,
} from '../../../../../slices/gameSession';
import { openModal } from '../../../../../slices/gameUi';
import s from './GamePlayPlaceholder.module.css';
import { randomInteger } from '../../../../../utils/randomeInteger';

type ItemKind = 'edible' | 'inedible' | 'shard';

interface PlayItem {
  id: number;
  foodId: number;
  kind: ItemKind;
  xPx: number;
  spawnedAt: number;
  sizeRatio?: number;
  fallDurationMs?: number;
  vxPxPerSec?: number;
}

interface StageSize {
  width: number;
  height: number;
}

// TODO брать настройки айтемов и всего прочего из базы
const ITEM_SIZE_RATIO = 1 / 4;
const MONSTER_SIZE_RATIO = 1 / 3;
const MONSTER_SEGMENT_OFFSET_RATIO = 0.8;
const MOUTH_INSET_FROM_HEAD_TOP_RATIO = 0.2;
const MOUTH_WIDTH_RATIO = 0.5;
const MOUTH_ZONE_HALF_HEIGHT_RATIO = 0.08;

const FALL_DURATION_MS = 4500;
const MIN_SPAWN_MS = 2000;
const MAX_SPAWN_MS = 3000;
const MONSTER_SPEED_PER_SEC_RATIO = 0.18;
const ELAPSED_DISPATCH_THROTTLE_MS = 200;

const SHARD_SIZE_RATIO = ITEM_SIZE_RATIO * 0.5;
const SHARD_FALL_DURATION_MS = 3500;
const SHARDS_PER_SQUARE = 3;
const SHARD_SPREAD_SPEED_RATIO = 0.16;

const FOOD_ITEMS_QUANTITY = 24;
const INEDIBLE_ITEMS_QUANTITY = 8;
const DESSERTS_PACK_URL = '/images/desserts/dessert-';
const INEDIBLE_PACK_URL = '/images/inedible/inedible-';

const getItemSize = (item: PlayItem, stage: StageSize) =>
  stage.width * (item.sizeRatio ?? ITEM_SIZE_RATIO);

const computeItemTop = (item: PlayItem, now: number, stage: StageSize, itemSize: number) => {
  const fallDuration = item.fallDurationMs ?? FALL_DURATION_MS;
  const t = (now - item.spawnedAt) / fallDuration;

  return -itemSize + t * (stage.height + itemSize);
};

const computeItemLeft = (item: PlayItem, now: number, stage: StageSize, itemSize: number) => {
  const elapsedSec = (now - item.spawnedAt) / 1000;
  const rawLeft = item.xPx + (item.vxPxPerSec ?? 0) * elapsedSec;

  return Math.min(Math.max(rawLeft, 0), stage.width - itemSize);
};

/**
 * Заглушка игрового движка на DOM + RAF. Падающие предметы (круги/квадраты - потом будут хитбоксы)
 * двигаются JS-ом каждый кадр через style.top, монстр-гусеница тоже двигается
 * через JS (style.left), коллизия рта с предметом
 * Тут же ведётся таймер раунда (elapsedMs) и завершение уровня при durationMs.
 * делал по статье learn.javascript.ru/js-animation
 */
export const GamePlayPlaceholder = () => {
  const dispatch = useDispatch();
  const phase = useSelector(selectPhase);
  const meta = useSelector(selectLevelMeta);

  const [items, setItems] = useState<PlayItem[]>([]);
  const [stageSize, setStageSize] = useState<StageSize>({ width: 0, height: 0 });

  const itemsRef = useRef<PlayItem[]>([]);
  itemsRef.current = items;

  const stageSizeRef = useRef<StageSize>(stageSize);
  stageSizeRef.current = stageSize;

  const layerRef = useRef<HTMLDivElement>(null);
  const monsterAnchorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<number, HTMLElement>());

  const monsterXRef = useRef(0);
  const monsterInitializedRef = useRef(false);
  const lastIdRef = useRef(0);
  // id предметов, уже обработанных (пойман кликом / съеден / пропущен).
  // Синхронный источник правды, чтобы клик и RAF-кадр не засчитали один объект дважды.
  const consumedIdsRef = useRef(new Set<number>());
  const pauseStartRef = useRef<number | null>(null);
  const playStartedAtRef = useRef<number | null>(null);
  const lastElapsedDispatchRef = useRef(0);

  useEffect(() => {
    const el = layerRef.current;

    if (!el) {
      return;
    }

    const apply = (width: number, height: number) => {
      setStageSize({ width, height });

      if (!monsterInitializedRef.current) {
        monsterXRef.current = width / 2;
        monsterInitializedRef.current = true;
      }

      if (monsterAnchorRef.current) {
        monsterAnchorRef.current.style.left = `${monsterXRef.current}px`;
      }
    };

    apply(el.clientWidth, el.clientHeight);

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      apply(rect.width, rect.height);
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (phase === 'intro' || phase === 'ended') {
      setItems([]);
      consumedIdsRef.current.clear();
      pauseStartRef.current = null;
      playStartedAtRef.current = null;
      lastElapsedDispatchRef.current = 0;
      monsterXRef.current = stageSizeRef.current.width / 2;

      if (monsterAnchorRef.current) {
        monsterAnchorRef.current.style.left = `${monsterXRef.current}px`;
      }

      return;
    }

    if (phase === 'paused') {
      pauseStartRef.current = performance.now();

      return;
    }

    if (phase === 'playing' && pauseStartRef.current !== null) {
      const pauseDuration = performance.now() - pauseStartRef.current;
      setItems((prev) => prev.map((it) => ({ ...it, spawnedAt: it.spawnedAt + pauseDuration })));

      if (playStartedAtRef.current !== null) {
        playStartedAtRef.current += pauseDuration;
      }

      pauseStartRef.current = null;
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') {
      return;
    }

    let timerId = 0;

    const schedule = () => {
      const delay = MIN_SPAWN_MS + Math.random() * (MAX_SPAWN_MS - MIN_SPAWN_MS);

      timerId = window.setTimeout(() => {
        const stage = stageSizeRef.current;
        const itemSize = stage.width * ITEM_SIZE_RATIO;
        const minLeft = itemSize * 0.5;
        const maxLeft = stage.width - itemSize * 1.5;

        const foodKind = Math.random() <= 0.8 ? 'edible' : 'inedible';
        const randomFoodId =
          foodKind === 'edible'
            ? randomInteger(1, FOOD_ITEMS_QUANTITY)
            : randomInteger(1, INEDIBLE_ITEMS_QUANTITY);
        lastIdRef.current += 1;

        setItems((prev) => [
          ...prev,
          {
            id: lastIdRef.current,
            foodId: randomFoodId,
            kind: foodKind,
            xPx: minLeft + Math.random() * (maxLeft - minLeft),
            spawnedAt: performance.now(),
          },
        ]);
        schedule();
      }, delay);
    };

    schedule();

    return () => window.clearTimeout(timerId);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'playing') {
      return;
    }

    let rafId = 0;
    let lastFrame = performance.now();

    const tick = (now: number) => {
      const dt = (now - lastFrame) / 1000;
      lastFrame = now;

      if (playStartedAtRef.current === null) {
        playStartedAtRef.current = now;
        lastElapsedDispatchRef.current = 0;
      }

      const elapsed = now - playStartedAtRef.current;

      if (elapsed >= meta.durationMs) {
        dispatch(syncFromEngine({ elapsedMs: meta.durationMs }));
        dispatch(setPhase('ended'));
        dispatch(openModal('results'));

        return;
      }

      if (elapsed - lastElapsedDispatchRef.current >= ELAPSED_DISPATCH_THROTTLE_MS) {
        dispatch(syncFromEngine({ elapsedMs: elapsed }));
        lastElapsedDispatchRef.current = elapsed;
      }

      const stage = stageSizeRef.current;

      if (stage.width === 0 || stage.height === 0) {
        rafId = requestAnimationFrame(tick);

        return;
      }

      const itemSize = stage.width * ITEM_SIZE_RATIO;
      const monsterSize = stage.width * MONSTER_SIZE_RATIO;
      const monsterX = monsterXRef.current;

      const headCenterY = stage.height - MONSTER_SEGMENT_OFFSET_RATIO * monsterSize;
      const mouthCenterY =
        headCenterY - monsterSize / 2 + MOUTH_INSET_FROM_HEAD_TOP_RATIO * monsterSize;
      const mouthZoneTopY = mouthCenterY - MOUTH_ZONE_HALF_HEIGHT_RATIO * monsterSize;
      const mouthZoneBottomY = mouthCenterY + MOUTH_ZONE_HALF_HEIGHT_RATIO * monsterSize;
      const mouthHalfWidth = (monsterSize * MOUTH_WIDTH_RATIO) / 2;

      const current = itemsRef.current;
      const eatenIds: number[] = [];
      const missedIds: number[] = [];

      for (const item of current) {
        if (consumedIdsRef.current.has(item.id)) {
          continue;
        }

        const currentItemSize = getItemSize(item, stage);
        const itemTop = computeItemTop(item, now, stage, currentItemSize);
        const itemLeft = computeItemLeft(item, now, stage, currentItemSize);
        const el = itemRefs.current.get(item.id);

        if (el) {
          el.style.top = `${itemTop}px`;
          el.style.left = `${itemLeft}px`;
        }

        if (itemTop >= stage.height) {
          missedIds.push(item.id);
          consumedIdsRef.current.add(item.id);

          continue;
        }

        const itemBottom = itemTop + currentItemSize;
        const itemCenterX = itemLeft + currentItemSize / 2;

        const yOverlap = itemBottom >= mouthZoneTopY && itemTop <= mouthZoneBottomY;
        const xOverlap = Math.abs(itemCenterX - monsterX) < mouthHalfWidth + currentItemSize / 2;

        if (yOverlap && xOverlap) {
          eatenIds.push(item.id);
          consumedIdsRef.current.add(item.id);
        }
      }

      if (eatenIds.length > 0 || missedIds.length > 0) {
        const toRemove = new Set([...eatenIds, ...missedIds]);
        setItems((prev) => prev.filter((it) => !toRemove.has(it.id)));

        if (eatenIds.length > 0) {
          dispatch(incrementEaten(eatenIds.length));
        }

        if (missedIds.length > 0) {
          dispatch(incrementMissed(missedIds.length));
        }
      }

      // Монстр каждый кадр выбирает ближайший активный предмет.
      const remaining = current.filter((it) => !consumedIdsRef.current.has(it.id));

      if (remaining.length > 0) {
        const firstSize = getItemSize(remaining[0], stage);
        let nearestCx = computeItemLeft(remaining[0], now, stage, firstSize) + firstSize / 2;
        let nearestDist = Math.abs(nearestCx - monsterX);

        for (let i = 1; i < remaining.length; i += 1) {
          const currentSize = getItemSize(remaining[i], stage);
          const cx = computeItemLeft(remaining[i], now, stage, currentSize) + currentSize / 2;
          const dist = Math.abs(cx - monsterX);

          if (dist < nearestDist) {
            nearestCx = cx;
            nearestDist = dist;
          }
        }

        const dir = Math.sign(nearestCx - monsterX);
        const maxStep = MONSTER_SPEED_PER_SEC_RATIO * stage.width * dt;
        const step = Math.min(nearestDist, maxStep);

        if (step > 0.5) {
          monsterXRef.current = monsterX + dir * step;

          if (monsterAnchorRef.current) {
            monsterAnchorRef.current.style.left = `${monsterXRef.current}px`;
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, [phase, dispatch, meta.durationMs]);

  const handleCatch = (id: number) => {
    if (consumedIdsRef.current.has(id)) {
      return;
    }

    const clickedItem = itemsRef.current.find((it) => it.id === id);

    if (!clickedItem) {
      return;
    }

    consumedIdsRef.current.add(id);

    // Механика разбивания квадрата
    // Убираем из items square, по которому кликнули
    // Добавляем новые items shards вместо square
    if (clickedItem.kind === 'edible') {
      const now = performance.now();
      const stage = stageSizeRef.current;

      const parentSize = getItemSize(clickedItem, stage);
      const parentTop = computeItemTop(clickedItem, now, stage, parentSize);
      const parentLeft = computeItemLeft(clickedItem, now, stage, parentSize);

      const shardSize = stage.width * SHARD_SIZE_RATIO;
      const shardSpeed = stage.width * SHARD_SPREAD_SPEED_RATIO;

      const shards = Array.from({ length: SHARDS_PER_SQUARE }, (_, index) => {
        lastIdRef.current += 1;

        const direction = index - Math.floor(SHARDS_PER_SQUARE / 2);

        return {
          id: lastIdRef.current,
          kind: 'shard' as ItemKind,
          xPx: parentLeft + parentSize / 2 - shardSize / 2,
          spawnedAt:
            now - ((parentTop + shardSize) / (stage.height + shardSize)) * SHARD_FALL_DURATION_MS,
          sizeRatio: SHARD_SIZE_RATIO,
          fallDurationMs: SHARD_FALL_DURATION_MS,
          vxPxPerSec: direction * shardSpeed,
        };
      });

      setItems((prev) => [...prev.filter((it) => it.id !== id), ...shards]);

      return;
    }

    setItems((prev) => prev.filter((it) => it.id !== id));
    dispatch(incrementCaught());
  };

  const getFoodStyle = (foodItem: PlayItem) => {
    const foodImg =
      foodItem.kind === 'edible'
        ? `${DESSERTS_PACK_URL}${foodItem.foodId}.webp`
        : `${INEDIBLE_PACK_URL}${foodItem.foodId}.webp`;

    const backgroundImagePath = `url(${foodImg})`;

    const currentItemSize = getItemSize(foodItem, stageSize);

    const foodItemStyle = {
      left: `${foodItem.xPx}px`,
      top: `${-currentItemSize}px`,
      width: `${currentItemSize}px`,
      height: `${currentItemSize}px`,
      backgroundImage: backgroundImagePath,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    };

    return foodItemStyle;
  };

  const monsterSize = stageSize.width * MONSTER_SIZE_RATIO;

  const foodToCatch = items.map((item) => {
    return (
      <button
        key={item.id}
        ref={(el) => {
          if (el) {
            itemRefs.current.set(item.id, el);
          } else {
            itemRefs.current.delete(item.id);
          }
        }}
        type="button"
        tabIndex={-1}
        className={s.item}
        data-kind={item.kind}
        style={getFoodStyle(item)}
        onPointerDown={() => handleCatch(item.id)}
        aria-label={
          item.kind === 'edible'
            ? 'съедобный'
            : item.kind === 'inedible'
            ? 'несъедобный'
            : 'осколок'
        }
      />
    );
  });

  return (
    <>
      <div ref={layerRef} className={s.itemsLayer} aria-hidden>
        {foodToCatch}
      </div>
      <div className={s.monsterContainer} aria-hidden>
        <div
          ref={monsterAnchorRef}
          className={s.monsterAnchor}
          style={{ left: `${stageSize.width / 2}px` }}
        >
          <div
            className={s.monsterBody}
            style={{
              left: `${-monsterSize / 2}px`,
              bottom: `${-monsterSize / 2}px`,
              width: `${monsterSize}px`,
              height: `${monsterSize}px`,
            }}
          />
        </div>
      </div>
    </>
  );
};
