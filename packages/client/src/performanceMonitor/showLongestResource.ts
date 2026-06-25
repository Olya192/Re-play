/**
 * Метрики по самым долгим по загрузке ресурсам
 */
export const showAllResources = () => {
  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

  const partOfMetrics = entries.map((e) => ({
    url: e.name,
    duration: e.duration.toFixed(1) + ' ms',
    TTFB: (e.responseStart - e.requestStart).toFixed(1) + ' ms',
    size: (e.transferSize / 1024).toFixed(1) + ' KB',
    decodedBodySize: (e.decodedBodySize / 1024).toFixed(1) + ' KB',
    type: e.initiatorType,
    protocol: e.nextHopProtocol,
  }));

  const longestDurationResource = partOfMetrics
    .sort((a, b) => parseFloat(b.duration) - parseFloat(a.duration))
    .slice(0, 20);

  console.table(longestDurationResource);
};
