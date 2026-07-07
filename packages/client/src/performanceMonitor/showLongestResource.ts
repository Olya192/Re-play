/**
 * Метрики по самым долгим по загрузке ресурсам
 */
export const showAllResources = () => {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    const resourceMetricsEntries = performance.getEntriesByType(
      'resource'
    ) as PerformanceResourceTiming[];

    const resourceMetrics = resourceMetricsEntries.map((e) => ({
      url: e.name,
      duration: e.duration.toFixed(1) + ' ms',
      TTFB: (e.responseStart - e.requestStart).toFixed(1) + ' ms',
      size: (e.transferSize / 1024).toFixed(1) + ' KB',
      decodedBodySize: (e.decodedBodySize / 1024).toFixed(1) + ' KB',
      type: e.initiatorType,
      protocol: e.nextHopProtocol,
    }));

    const longestDurationResource = resourceMetrics
      .toSorted((a, b) => parseFloat(b.duration) - parseFloat(a.duration))
      .slice(0, 20);

    console.table(longestDurationResource);
  }
};
