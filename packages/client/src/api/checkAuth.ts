import { ErrorHandler } from '../utils/error/errorHandler';
import { authApi } from './authApi';

// Создаём отдельный экземпляр без интерсепторов если нужно

export const checkAuth = async (): Promise<boolean> => {
  try {
    await authApi.getCurrentUser();

    return true;
  } catch (error) {
    console.error('Auth check failed:', error);
    ErrorHandler.showUserError(error, 'checkAuth');

    return false;
  }
};

// Получаем данные пользователя (если нужны)
export const getCurrentUser = async () => {
  try {
    const user = await authApi.getCurrentUser();

    return user;
  } catch (error) {
    console.error('Failed to get user:', error);

    return null;
  }
};
