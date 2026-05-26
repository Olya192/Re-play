export const queryStringify = (data: Record<string, unknown>) => {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Data must be a non-null object');
  }

  const keys = Object.keys(data);

  if (keys.length === 0) {
    return '';
  }

  const queryParams = keys.reduce((result, key, index) => {
    const value = data[key];
    const valueType = typeof value;
    const isValidValueType =
      valueType === 'string' || valueType === 'number' || valueType === 'boolean';

    if (!isValidValueType) {
      return result;
    }

    const encodedKey = encodeURIComponent(key);
    const encodedValue = encodeURIComponent(value as string | number | boolean);

    const separator = index < keys.length - 1 ? '&' : '';

    return `${result}${encodedKey}=${encodedValue}${separator}`;
  }, '?');

  const cleanedQueryParams = queryParams.replace(/&$/, '');

  return cleanedQueryParams;
};
