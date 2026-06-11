import { ERROR_MESSAGES, HttpStatus, NETWORK_ERROR_CODES } from '../../constants/api/httpStatus';

type ErrorWithMessage = {
  message: string;
};

type ErrorWithResponse = {
  response: {
    data?: {
      reason?: string;
    };
    status?: number;
  };
};

type NetworkError = {
  code: string;
};

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
};

const isErrorWithResponse = (error: unknown): error is ErrorWithResponse => {
  if (typeof error !== 'object' || error === null) {
    return false;
  }

  const possibleError = error as Record<string, unknown>;

  if (!('response' in possibleError)) {
    return false;
  }

  const response = possibleError.response;

  if (typeof response !== 'object' || response === null) {
    return false;
  }

  const responseObj = response as Record<string, unknown>;

  if ('data' in responseObj && responseObj.data !== undefined) {
    if (typeof responseObj.data !== 'object' || responseObj.data === null) {
      return false;
    }

    const dataObj = responseObj.data as Record<string, unknown>;

    if ('reason' in dataObj && dataObj.reason !== undefined) {
      if (typeof dataObj.reason !== 'string') {
        return false;
      }
    }
  }

  if ('status' in responseObj && responseObj.status !== undefined) {
    if (typeof responseObj.status !== 'number') {
      return false;
    }
  }

  return true;
};

const isNetworkError = (error: unknown): error is NetworkError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as Record<string, unknown>).code === 'string'
  );
};

export const getErrorMessage = (error: unknown): string => {
  if (isErrorWithResponse(error) && error.response.data?.reason) {
    return error.response.data.reason;
  }

  if (isErrorWithMessage(error)) {
    return error.message;
  }

  return ERROR_MESSAGES.DATA_SEND;
};

export class ErrorHandler {
  static showUserError(error: unknown, context: string): string {
    // Явно указываем тип string
    let userMessage: string = ERROR_MESSAGES.DEFAULT;

    console.error(`Error in ${context}:`, error);

    if (isErrorWithResponse(error)) {
      const status = error.response.status;

      switch (status) {
        case HttpStatus.UNAUTHORIZED:
          userMessage = ERROR_MESSAGES.SESSION_EXPIRED;
          window.location.href = '/login';
          break;
        case HttpStatus.FORBIDDEN:
          userMessage = ERROR_MESSAGES.FORBIDDEN;
          break;
        case HttpStatus.INTERNAL_SERVER_ERROR:
          userMessage = ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          // Можно добавить обработку других статусов
          if (status && status >= 400 && status < 500) {
            userMessage = `Ошибка клиента: ${status}`;
          } else if (status && status >= 500) {
            userMessage = ERROR_MESSAGES.SERVER_ERROR;
          }
      }
    }

    if (isNetworkError(error) && error.code === NETWORK_ERROR_CODES.NETWORK_ERROR) {
      userMessage = ERROR_MESSAGES.NETWORK;
    }

    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: userMessage, type: 'error' },
      })
    );

    return userMessage;
  }

  // Дополнительный метод для проверки статусов без дублирования логики
  static isHttpError(error: unknown, statusCode: HttpStatus): boolean {
    return isErrorWithResponse(error) && error.response.status === statusCode;
  }

  static redirectOnUnauthorized(error: unknown): boolean {
    if (this.isHttpError(error, HttpStatus.UNAUTHORIZED)) {
      window.location.href = '/login';

      return true;
    }

    return false;
  }
}
