export const checkIsObject = (value: unknown): boolean => {
  const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);

  return isObject;
};
