import { LOGIN_MAX_LENGTH } from '../../constants/constants';
import { FORBIDDEN_LOGIN_CHARS_REGEXP } from '../../constants/regexp';

export const normalizeLogin = (login: string): string => {
  if (!login) {
    return login;
  }

  const normalizedLogin = login
    .trim()
    .slice(0, LOGIN_MAX_LENGTH)
    .replace(FORBIDDEN_LOGIN_CHARS_REGEXP, '');

  return normalizedLogin;
};
