// services/auth.ts

import { authApi } from './authApi';
import { HTTPTransport } from './httpTransport';

// Создаём отдельный экземпляр без интерсепторов если нужно
const checkAuthInstance = new HTTPTransport();

export const checkAuth = async (): Promise<boolean> => {
  try {
    // Пытаемся получить текущего пользователя
    await authApi.getCurrentUser();

    return true; // Если запрос успешен - пользователь авторизован
  } catch (error) {
    console.error('Auth check failed:', error);

    return false; // Если ошибка (обычно 401) - не авторизован
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
