import { DIGITS_REGEXP, LOGIN_CHARS_REGEXP } from 'client/src/constants/validation/regexp';

export const validateText = (value: unknown, fieldName: string, maxLength: number): string => {
  if (typeof value !== 'string') {
    throw new Error(`Поле "${fieldName}" должно быть строкой`);
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error(`Поле "${fieldName}" обязательно`);
  }

  if (trimmedValue.length > maxLength) {
    throw new Error(`Поле "${fieldName}" должно содержать не больше ${maxLength} символов`);
  }

  if (/[<>]/.test(trimmedValue)) {
    throw new Error(`HTML-разметка в поле "${fieldName}" запрещена`);
  }

  return trimmedValue;
};

export const validateLogin = (value: unknown): string => {
  if (typeof value !== 'string') {
    throw new Error('Логин должен быть строкой');
  }

  const login = value.trim();

  if (login.length < 3 || login.length > 20) {
    throw new Error('Логин должен содержать от 3 до 20 символов');
  }

  if (!LOGIN_CHARS_REGEXP.test(login) || DIGITS_REGEXP.test(login)) {
    throw new Error('Некорректный логин');
  }

  return login;
};
