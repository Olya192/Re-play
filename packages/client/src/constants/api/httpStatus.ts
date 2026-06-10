export enum HttpStatus {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
}

export const NETWORK_ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  ECONN_REFUSED: 'ECONN_REFUSED',
  TIMEOUT: 'TIMEOUT_ERROR',
} as const;

export const ERROR_MESSAGES = {
  NETWORK: 'Проверьте подключение к интернету',
  SESSION_EXPIRED: 'Сессия истекла. Пожалуйста, войдите снова.',
  FORBIDDEN: 'У вас нет прав для выполнения этого действия',
  SERVER_ERROR: 'Ошибка на сервере. Мы уже работаем над этим.',
  DEFAULT: 'Произошла ошибка',
  DATA_SEND: 'Произошла ошибка при отправке данных',
} as const;
