import { useEffect, useRef } from 'react';

/**
 * Хук - время хук измеряет время от создания до первого useEffect при монтировании
 */
export function useComponentMountDuration(componentName: string) {
  const startTime = useRef(performance.now());
  const isDev = process.env.NODE_ENV === 'development';

  useEffect(() => {
    if (isDev) {
      const duration = performance.now() - startTime.current;

      console.group(`Render: ${componentName}`);
      console.log(
        `Время от создания до первого useEffect при монтировании - ${duration.toFixed(2)} ms`
      );
      console.groupEnd();
    }
  }, [componentName]);
}
