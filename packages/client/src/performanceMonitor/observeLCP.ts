/**
 * Предоставляет время рендеринга самого большого изображения или текстового блока, видимого в области просмотра, записанное с момента первой загрузки страницы
 */
export function observeLCP() {
  const isDev = process.env.NODE_ENV === 'development';
  const isPerformanceObserver = typeof PerformanceObserver !== 'undefined';

  if (isDev && isPerformanceObserver) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      if (entries.length) {
        const lastEntry = entries[entries.length - 1];

        console.group('Самый крупный элемент');
        console.log(`Largest Contentful Paint (LCP): ${lastEntry.startTime.toFixed(2)} ms`);
        console.log(lastEntry);
        console.groupEnd();
      }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });

    return () => {
      observer.disconnect();
    };
  }

  return () => {
    console.log('PerformanceObserver не поддерживается');
  };
}
