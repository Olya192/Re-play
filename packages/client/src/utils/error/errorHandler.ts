type ErrorWithMessage = {
  message: string;
};

type ErrorWithResponse = {
  response?: {
    data?: {
      reason?: string;
    };
  };
};

const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ErrorWithMessage).message === 'string'
  );
};

const isErrorWithResponse = (error: unknown): error is ErrorWithResponse => {
  return typeof error === 'object' && error !== null && 'response' in error;
};

export const getErrorMessage = (error: unknown): string => {
  if (isErrorWithResponse(error) && error.response?.data?.reason) {
    return error.response.data.reason;
  }

  if (isErrorWithMessage(error)) {
    return error.message;
  }

  return 'Произошла ошибка при отправке данных';
};

export class ErrorHandler {
  static showUserError(error: any, context: string) {
    let userMessage = 'Произошла ошибка';

    if (error?.response?.status === 401) {
      userMessage = 'Сессия истекла. Пожалуйста, войдите снова.';

      window.location.href = '/login';
    } else if (error?.response?.status === 403) {
      userMessage = 'У вас нет прав для выполнения этого действия';
    } else if (error?.response?.status === 500) {
      userMessage = 'Ошибка на сервере. Мы уже работаем над этим.';
    } else if (error?.code === 'NETWORK_ERROR') {
      userMessage = 'Проверьте подключение к интернету';
    }

    window.dispatchEvent(
      new CustomEvent('show-notification', {
        detail: { message: userMessage, type: 'error' },
      })
    );

    return userMessage;
  }
}
