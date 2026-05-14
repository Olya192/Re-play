import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '../../constants/constants';
import { ONE_CAPITAL_LETTER_REGEXP, ONE_DIGIT_REGEXP } from '../../constants/regexp';

export const validatePassword = (password: string): boolean => {
  const passwordLength = password.length;
  const isLengthValid =
    passwordLength >= PASSWORD_MIN_LENGTH && passwordLength <= PASSWORD_MAX_LENGTH;

  const areCharsValid = ONE_CAPITAL_LETTER_REGEXP.test(password) && ONE_DIGIT_REGEXP.test(password);

  const isPasswordValid = isLengthValid && areCharsValid;

  return isPasswordValid;
};
