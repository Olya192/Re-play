/**
 * Предоставляет время рендеринга самого большого изображения или текстового блока, видимого в области просмотра, записанное с момента первой загрузки страницы
 */
export function observeLCP() {
  if (typeof PerformanceObserver !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      console.group('Самый крупный элемент');
      console.log(`Largest Contentful Paint (LCP): ${lastEntry.startTime.toFixed(2)} ms`);
      console.log(lastEntry);
      console.groupEnd();
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  }
}
