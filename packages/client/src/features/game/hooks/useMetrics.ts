import { observeLCP } from '@/performanceMonitor';
import { useEffect } from 'react';
import { MINUTES_IN_MS } from '@/constants';

export const useMetrics = () => {
  const cleanupObserver = observeLCP();
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    return () => cleanupObserver();
  }, []);

  // Время, проведенное на странице игры
  useEffect(() => {
    if (isDev) {
      performance.mark('start-game');

      return () => {
        performance.mark('finish-game');

        try {
          const gameDetail = performance.measure('game', 'start-game', 'finish-game');
          const duration = (gameDetail.duration / MINUTES_IN_MS).toFixed(2);
          console.group('Метрики игры');
          console.log(`Длительность игры: ${duration} мин`);
          console.groupEnd();
        } catch {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Не удалось измерить длительность игры (метки не найдены)');
          }
        } finally {
          performance.clearMeasures('game');
          performance.clearMarks('start-game');
          performance.clearMarks('finish-game');
        }
      };
    }
  }, []);
};
