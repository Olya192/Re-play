import { EMAIL_REGEXP } from '../../constants/validation/regexp';
import { EMAIL_MAX_LENGTH } from '../../constants/validation/constants';

export const validateEmail = (value: string): boolean => {
  const isLengthValid = value && value.length <= EMAIL_MAX_LENGTH;

  if (!isLengthValid) {
    return false;
  }

  const isEmailValid = EMAIL_REGEXP.test(value);

  return isEmailValid;
};
