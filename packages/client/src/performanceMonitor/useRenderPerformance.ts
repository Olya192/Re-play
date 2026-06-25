import { useEffect, useRef } from 'react';

/**
 * Хук - время отрисовки от старта загрузки до полной отрисовки
 */
export function useRenderPerformance(componentName: string) {
  const startTime = useRef(performance.now());

  useEffect(() => {
    const duration = performance.now() - startTime.current;

    console.group(`Render: ${componentName}`);
    console.log(`Rendered in ${duration.toFixed(2)} ms`);
    console.groupEnd();
  }, []);
}
