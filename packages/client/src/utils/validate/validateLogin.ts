import { LOGIN_MAX_LENGTH, LOGIN_MIN_LENGTH } from '../../constants/validation/constants';
import { DIGITS_REGEXP, LOGIN_CHARS_REGEXP } from '../../constants/validation/regexp';

export const validateLogin = (login: string): boolean => {
  const loginLength = login.length;
  const isLengthValid = loginLength >= LOGIN_MIN_LENGTH && loginLength <= LOGIN_MAX_LENGTH;

  if (!isLengthValid) {
    return false;
  }

  const isLoginValid = LOGIN_CHARS_REGEXP.test(login) && !DIGITS_REGEXP.test(login);

  return isLoginValid;
};
