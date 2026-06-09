import { UPPER_LETTER_REGEXP } from '../../constants/regexp';

export const convertCamelToSnake = (str: string) => {
  const convertedStr = str.replace(UPPER_LETTER_REGEXP, (letter) => `_${letter.toLowerCase()}`);

  return convertedStr;
};
