export const queryStringify = (data: Record<string, unknown>): string => {
  const paramsEntries = Object.entries(data);

  const params = new URLSearchParams();

  for (const [key, value] of paramsEntries) {
    const valueType = typeof value;

    if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
      params.append(key, String(value));
    } else {
      throw new Error(`Невалидное значение для ключа ${key}`);
    }
  }

  const result = params.toString();
  const cleanedQueryParams = result ? `?${result}` : '';

  return cleanedQueryParams;
};
