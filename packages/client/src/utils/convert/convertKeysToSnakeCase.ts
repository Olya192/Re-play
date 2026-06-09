import { convertCamelToSnake } from './convertCamelToSnake';
import { checkIsObject } from '../checkIsObject';

export const convertKeysToSnakeCase = (obj: Record<string, unknown>): Record<string, unknown> => {
  const isObject = checkIsObject(obj);

  if (!isObject) {
    return obj;
  }

  const arrayFromObject = Object.entries(obj);

  const convertedEntries = arrayFromObject.map(([key, value]) => {
    const snakeKey = convertCamelToSnake(key);
    let convertedValue = value;
    const isValueObject = checkIsObject(value);

    if (isValueObject) {
      convertedValue = convertKeysToSnakeCase(value as Record<string, unknown>);
    }

    return [snakeKey, convertedValue];
  });

  const convertedObject = Object.fromEntries(convertedEntries);

  return convertedObject;
};
