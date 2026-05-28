import React, { useEffect, useRef, useState } from 'react';
import styles from './GameUI.module.css';
import type { GameEndReason, GameStatus, ObjectType } from '../../../types/game/game';

interface GameUIProps {
  collectedFood: ObjectType[];
  endReason: GameEndReason;
  score: number;
  status: GameStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onGoHome: () => void;
}

type FoodBody = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  delayMs: number;
  active: boolean;
};

const PILE_HEIGHT = 160;
const FOOD_RADIUS = 12;
const GRAVITY = 1500;
const FLOOR_BOUNCE = 0.08;
const WALL_BOUNCE = 0.12;
const AIR_DRAG = 0.985;

const createFoodBodies = (count: number, pileWidth: number): FoodBody[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index,
    x: FOOD_RADIUS + 18 + ((index * 43) % Math.max(pileWidth - FOOD_RADIUS * 2 - 36, 40)),
    y: -80 - index * 26,
    vx: ((index % 5) - 2) * 18,
    vy: 0,
    radius: FOOD_RADIUS,
    delayMs: index * 70,
    active: false,
  }));

const resolveCollisions = (bodies: FoodBody[]) => {
  for (let iteration = 0; iteration < 3; iteration += 1) {
    for (let i = 0; i < bodies.length; i += 1) {
      const a = bodies[i];

      if (!a.active) {
        continue;
      }

      for (let j = i + 1; j < bodies.length; j += 1) {
        const b = bodies[j];

        if (!b.active) {
          continue;
        }

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minDistance = a.radius + b.radius;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq === 0 || distanceSq >= minDistance * minDistance) {
          continue;
        }

        const distance = Math.sqrt(distanceSq) || 0.001;
        const overlap = minDistance - distance;
        const nx = dx / distance;
        const ny = dy / distance;
        const shift = overlap * 0.5;

        a.x -= nx * shift;
        a.y -= ny * shift;
        b.x += nx * shift;
        b.y += ny * shift;

        const relativeVelocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;

        if (relativeVelocity < 0) {
          const impulse = relativeVelocity * -0.08;

          a.vx -= impulse * nx;
          a.vy -= impulse * ny;
          b.vx += impulse * nx;
          b.vy += impulse * ny;
        }
      }
    }
  }
};

const VictoryFoodPile = ({ count }: { count: number }) => {
  const pileRef = useRef<HTMLDivElement | null>(null);
  const [pileWidth, setPileWidth] = useState(280);
  const [bodies, setBodies] = useState<FoodBody[]>(() => createFoodBodies(count, 280));

  useEffect(() => {
    const node = pileRef.current;

    if (!node) {
      return;
    }

    const updateWidth = () => {
      setPileWidth(node.clientWidth || 280);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    resizeObserver.observe(node);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!count) {
      setBodies([]);

      return;
    }

    const nextBodies = createFoodBodies(count, pileWidth);
    setBodies(nextBodies);

    let animationFrameId = 0;
    let previousTime = 0;
    let elapsed = 0;

    const tick = (time: number) => {
      if (!previousTime) {
        previousTime = time;
      }

      const dt = Math.min((time - previousTime) / 1000, 0.024);
      previousTime = time;
      elapsed += dt * 1000;

      setBodies((currentBodies) => {
        const updatedBodies = currentBodies.map((body) => {
          if (!body.active && elapsed >= body.delayMs) {
            return { ...body, active: true };
          }

          if (!body.active) {
            return body;
          }

          let vx = body.vx * AIR_DRAG;
          let vy = body.vy + GRAVITY * dt;
          let x = body.x + vx * dt;
          let y = body.y + vy * dt;

          if (x - body.radius < 0) {
            x = body.radius;
            vx = Math.abs(vx) * WALL_BOUNCE;
          }

          if (x + body.radius > pileWidth) {
            x = pileWidth - body.radius;
            vx = -Math.abs(vx) * WALL_BOUNCE;
          }

          if (y + body.radius > PILE_HEIGHT) {
            y = PILE_HEIGHT - body.radius;
            vy = -Math.abs(vy) * FLOOR_BOUNCE;

            if (Math.abs(vy) < 10) {
              vy = 0;
            }
          }

          if (Math.abs(vx) < 4) {
            vx = 0;
          }

          return {
            ...body,
            x,
            y,
            vx,
            vy,
          };
        });

        resolveCollisions(updatedBodies);

        return updatedBodies.map((body) => {
          if (!body.active) {
            return body;
          }

          let x = body.x;
          let y = body.y;
          let vx = body.vx;
          let vy = body.vy;

          if (x - body.radius < 0) {
            x = body.radius;
            vx = 0;
          }

          if (x + body.radius > pileWidth) {
            x = pileWidth - body.radius;
            vx = 0;
          }

          if (y + body.radius > PILE_HEIGHT) {
            y = PILE_HEIGHT - body.radius;
            vy = 0;
          }

          if (Math.abs(vx) < 3) {
            vx = 0;
          }

          if (Math.abs(vy) < 3) {
            vy = 0;
          }

          return {
            ...body,
            x,
            y,
            vx,
            vy,
          };
        });
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, pileWidth]);

  return (
    <div ref={pileRef} className={styles.foodPile} aria-label="Контейнер с собранной едой">
      {bodies
        .filter((body) => body.active)
        .map((body) => (
          <span
            key={body.id}
            className={styles.foodPileItem}
            style={
              {
                width: `${body.radius * 2}px`,
                height: `${body.radius * 2}px`,
                left: `${body.x - body.radius}px`,
                top: `${body.y - body.radius}px`,
              } as React.CSSProperties
            }
          />
        ))}
    </div>
  );
};

export const GameUI: React.FC<GameUIProps> = ({
  collectedFood,
  endReason,
  score,
  status,
  onStart,
  onPause,
  onResume,
  onGoHome,
}) => {
  return (
    <div className={styles.ui} data-game-ui="true">
      <div className={styles.score}>Очки: {score}</div>

      {status === 'idle' && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Начало игры</h2>
            <div className={styles.modalBody}>
              <p>Кликай по еде, чтобы собрать её</p>
              <p>Не дай монстру съесть добычу</p>
              <p>Срезай лозу кликами, чтобы она не доросла до верха</p>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} onClick={onStart}>
                Начать игру
              </button>
              <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onGoHome}>
                Вернуться на главную
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'playing' && (
        <button className={styles.pauseButton} onClick={onPause} data-game-ui="true">
          Пауза
        </button>
      )}

      {status === 'paused' && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Пауза</h2>
            <div className={styles.modalBody}>
              <p>Игра остановлена</p>
              <p>При выходе прогресс не сохранится</p>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} onClick={onResume}>
                Продолжить
              </button>
              <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onGoHome}>
                Вернуться на главную
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'gameover' && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Игра окончена</h2>
            <div className={styles.modalBody}>
              <p>
                {endReason === 'negativeScore'
                  ? 'День закончился, но итоговый счёт ушёл в минус'
                  : 'Лоза достигла верха поля'}
              </p>
              <p>Твой счёт: {score}</p>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} onClick={onStart}>
                Играть снова
              </button>
              <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onGoHome}>
                Вернуться на главную
              </button>
            </div>
          </div>
        </div>
      )}

      {status === 'victory' && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>Победа</h2>
            <div className={styles.modalBody}>
              <p>День закончился</p>
              <p>Твой счёт: {score}</p>
              <div className={styles.collectedFoodBlock}>
                <p className={styles.collectedFoodTitle}>Собранная еда: {collectedFood.length}</p>
                {collectedFood.length ? (
                  <VictoryFoodPile count={collectedFood.length} />
                ) : (
                  <p>Ты не собрал ни одного фрукта.</p>
                )}
              </div>
            </div>
            <div className={styles.actions}>
              <button className={styles.button} onClick={onStart}>
                Играть снова
              </button>
              <button className={`${styles.button} ${styles.secondaryButton}`} onClick={onGoHome}>
                Вернуться на главную
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
