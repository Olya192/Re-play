import { User } from '../../types/user/user';

export const PROFILE_FIELDS: Partial<Record<keyof User, string>> = {
  email: 'Почта',
  login: 'Логин',
  firstName: 'Имя',
  secondName: 'Фамилия',
  displayName: 'Имя в чате',
  phone: 'Телефон',
} as const;
