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

type ItemKind = 'circle' | 'square';

interface PlayItem {
  id: number;
  kind: ItemKind;
  xPx: number;
  spawnedAt: number;
}

interface StageSize {
  width: number;
  height: number;
}

// TODO брать настройки айтемов и всего прочего из базы
const ITEM_SIZE_RATIO = 1 / 6;
const MONSTER_SIZE_RATIO = 1 / 5;
const MONSTER_SEGMENT_OFFSET_RATIO = 0.8;
const MOUTH_INSET_FROM_HEAD_TOP_RATIO = 0.2;
const MOUTH_WIDTH_RATIO = 0.5;
const MOUTH_HEIGHT_RATIO = 0.07;
const MOUTH_ZONE_HALF_HEIGHT_RATIO = 0.08;

const FALL_DURATION_MS = 4500;
const MIN_SPAWN_MS = 2000;
const MAX_SPAWN_MS = 3000;
const MONSTER_SPEED_PER_SEC_RATIO = 0.18;
const ELAPSED_DISPATCH_THROTTLE_MS = 200;

const computeItemTop = (item: PlayItem, now: number, stage: StageSize, itemSize: number) => {
  const t = (now - item.spawnedAt) / FALL_DURATION_MS;

  return -itemSize + t * (stage.height + itemSize);
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
  const lastIdRef = useRef(0);
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

      if (monsterXRef.current === 0) {
        monsterXRef.current = width / 2;
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

        lastIdRef.current += 1;
        setItems((prev) => [
          ...prev,
          {
            id: lastIdRef.current,
            kind: Math.random() < 0.5 ? 'circle' : 'square',
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
        const itemTop = computeItemTop(item, now, stage, itemSize);
        const el = itemRefs.current.get(item.id);

        if (el) {
          el.style.top = `${itemTop}px`;
        }

        if (itemTop >= stage.height) {
          missedIds.push(item.id);

          continue;
        }

        const itemBottom = itemTop + itemSize;
        const itemCenterX = item.xPx + itemSize / 2;

        const yOverlap = itemBottom >= mouthZoneTopY && itemTop <= mouthZoneBottomY;
        const xOverlap = Math.abs(itemCenterX - monsterX) < mouthHalfWidth + itemSize / 2;

        if (yOverlap && xOverlap) {
          eatenIds.push(item.id);
        }
      }

      if (eatenIds.length > 0 || missedIds.length > 0) {
        const toRemove = new Set([...eatenIds, ...missedIds]);
        setItems((prev) => prev.filter((it) => !toRemove.has(it.id)));

        for (let i = 0; i < eatenIds.length; i += 1) {
          dispatch(incrementEaten());
        }

        for (let i = 0; i < missedIds.length; i += 1) {
          dispatch(incrementMissed());
        }
      }

      // TODO: доработать поведение, чтобы шёл к ближайшему падающему,
      //       если его взорвали — к следующему ближайшему
      const consumed = new Set([...eatenIds, ...missedIds]);
      const remaining = current.filter((it) => !consumed.has(it.id));

      if (remaining.length > 0) {
        let nearestCx = remaining[0].xPx + itemSize / 2;
        let nearestDist = Math.abs(nearestCx - monsterX);

        for (let i = 1; i < remaining.length; i += 1) {
          const cx = remaining[i].xPx + itemSize / 2;
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
    setItems((prev) => prev.filter((it) => it.id !== id));
    dispatch(incrementCaught());
  };

  const itemSize = stageSize.width * ITEM_SIZE_RATIO;
  const monsterSize = stageSize.width * MONSTER_SIZE_RATIO;
  const headBottom = MONSTER_SEGMENT_OFFSET_RATIO * monsterSize - monsterSize / 2;
  const mouthTop = MOUTH_INSET_FROM_HEAD_TOP_RATIO * monsterSize;
  const mouthWidth = monsterSize * MOUTH_WIDTH_RATIO;
  const mouthHeight = monsterSize * MOUTH_HEIGHT_RATIO;

  return (
    <>
      <div ref={layerRef} className={s.itemsLayer} aria-hidden>
        {items.map((item) => (
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
            className={s.item}
            data-kind={item.kind}
            style={{
              left: `${item.xPx}px`,
              top: `${-itemSize}px`,
              width: `${itemSize}px`,
              height: `${itemSize}px`,
            }}
            onPointerDown={() => handleCatch(item.id)}
            aria-label={item.kind === 'circle' ? 'круг' : 'квадрат'}
          />
        ))}
      </div>
      <div className={s.monsterContainer} aria-hidden>
        <div
          ref={monsterAnchorRef}
          className={s.monsterAnchor}
          style={{ left: `${stageSize.width / 2}px` }}
        >
          <div
            className={s.body}
            style={{
              left: `${-monsterSize / 2}px`,
              bottom: `${-monsterSize / 2}px`,
              width: `${monsterSize}px`,
              height: `${monsterSize}px`,
            }}
          />
          <div
            className={s.head}
            style={{
              left: `${-monsterSize / 2}px`,
              bottom: `${headBottom}px`,
              width: `${monsterSize}px`,
              height: `${monsterSize}px`,
            }}
          >
            <div
              className={s.mouth}
              style={{
                left: `${(monsterSize - mouthWidth) / 2}px`,
                top: `${mouthTop}px`,
                width: `${mouthWidth}px`,
                height: `${mouthHeight}px`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
