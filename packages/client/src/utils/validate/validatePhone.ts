import { PHONE_MAX_LENGTH, PHONE_MIN_LENGTH } from '../../constants/validation/constants';
import { PHONE_REGEXP } from '../../constants/validation/regexp';

export const validatePhone = (phone: string): boolean => {
  const phoneLength = phone.length;
  const isLengthValid = phoneLength >= PHONE_MIN_LENGTH && phoneLength <= PHONE_MAX_LENGTH;

  const areCharsValid = PHONE_REGEXP.test(phone);
  const isPhoneValid = isLengthValid && areCharsValid;

  return isPhoneValid;
};
