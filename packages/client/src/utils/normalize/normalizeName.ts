import { NAME_MAX_LENGTH } from '../../constants/validation/constants';

export const normalizeName = (name: string): string => {
  if (!name) {
    return name;
  }

  const value = name.trim().slice(0, NAME_MAX_LENGTH);
  const normalizedName = value[0].toUpperCase() + value.slice(1);

  return normalizedName;
};
