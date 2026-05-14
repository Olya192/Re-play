import { FIRST_LETTER_CAPITAL_REGEXP, NAME_CHARS_REGEXP } from '../../constants/regexp';
import { NAME_MAX_LENGTH } from '../../constants/constants';

export const validateName = (name: string): boolean => {
  const isNameLengthValid = name && name.length <= NAME_MAX_LENGTH;

  if (!isNameLengthValid) {
    return false;
  }

  const isNameValid = FIRST_LETTER_CAPITAL_REGEXP.test(name) && NAME_CHARS_REGEXP.test(name);

  return isNameValid;
};
