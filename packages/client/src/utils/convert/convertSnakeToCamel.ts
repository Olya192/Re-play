import { SNAKE_CASE_REGEXP } from '../../constants/regexp';

export const convertSnakeToCamel = (str: string) => {
  const convertedStr = str.replace(SNAKE_CASE_REGEXP, (_, letter) => letter.toUpperCase());

  return convertedStr;
};
