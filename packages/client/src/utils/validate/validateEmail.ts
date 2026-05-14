import { EMAIL_REGEXP } from '../../constants/regexp';
import { LOGIN_MAX_LENGTH } from '../../constants/constants';

export const validateEmail = (value: string): boolean => {
  const isLengthValid = value && value.length <= LOGIN_MAX_LENGTH;

  if (!isLengthValid) {
    return false;
  }

  const isEmailValid = EMAIL_REGEXP.test(value);

  return isEmailValid;
};
