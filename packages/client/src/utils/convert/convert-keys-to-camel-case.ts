import { convertSnakeToCamel } from './convert-snake-to-camel';
import { checkIsObject } from '../checkIsObject';

export const convertKeysToCamelCase = (obj: Record<string, unknown>): Record<string, unknown> => {
  const isObject = checkIsObject(obj);

  if (!isObject) {
    return obj;
  }

  const arrayFromObject = Object.entries(obj);

  const convertedEntries = arrayFromObject.map(([key, value]) => {
    const camelKey = convertSnakeToCamel(key);
    let convertedValue = value;
    const isValueObject = checkIsObject(value);

    if (isValueObject) {
      convertedValue = convertKeysToCamelCase(value as Record<string, unknown>);
    }

    return [camelKey, convertedValue];
  });

  const convertedObject = Object.fromEntries(convertedEntries);

  return convertedObject;
};
