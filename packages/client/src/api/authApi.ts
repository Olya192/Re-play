// api/authApi.ts
import { AUTH_ROUTES, SERVER_ROUTES } from '../constants/api/apiConstants';
import { convertKeysToCamelCase } from '../utils/convert/convertKeysToCamelCase';
import { externalApi, serverApi } from './apiInstances';
import { HTTPTransport } from './httpTransport';

interface SignupData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

interface SigninData {
  login: string;
  password: string;
}

interface User {
  id: number;
  firstName: string;
  secondName: string;
  displayName: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

interface ServiceID {
  service_id: string;
}

const authApiInstance = new HTTPTransport();

class AuthApi {
  // ===== Обычная регистрация/вход (внешнее API) =====

  signup(data: SignupData): Promise<{ id: number }> {
    return externalApi.post(AUTH_ROUTES.SIGNUP, {
      data: { ...data },
    });
  }

  signin(data: SigninData): Promise<unknown> {
    return externalApi.post(AUTH_ROUTES.SIGNIN, {
      data: { ...data },
    });
  }

  logoutExternal(): Promise<unknown> {
    return externalApi.post(AUTH_ROUTES.LOGOUT);
  }

  async getCurrentUserExternal(signal?: AbortSignal): Promise<User> {
    const response = await externalApi.get(AUTH_ROUTES.USER, { signal });

    return convertKeysToCamelCase(response) as unknown as User;
  }

  // ===== OAuth через Яндекс =====

  // 1. Получение service_id напрямую от API практикума
  async getServiceID(redirectUri: string): Promise<string> {
    try {
      console.log('📤 Запрос service_id для:', redirectUri);

      // ✅ Используем fetch напрямую, так как это GET с query параметрами
      const response = await fetch(
        `https://ya-praktikum.tech/api/v2/oauth/yandex/service-id?redirect_uri=${encodeURIComponent(
          redirectUri
        )}`
      );

      if (!response.ok) {
        throw new Error(`Ошибка получения service_id: ${response.status}`);
      }

      const data: ServiceID = await response.json();

      if (!data.service_id) {
        throw new Error('Сервер не вернул service_id');
      }

      console.log('✅ Получен service_id:', data.service_id);

      return data.service_id;
    } catch (error) {
      console.error('❌ Ошибка получения service_id:', error);
      throw error;
    }
  }

  // 2. Обмен code на сессию через ваш сервер
  async loginWithYandex(
    code: string,
    redirectUri: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('📤 Отправка code на сервер для обмена...');

      const response = await fetch('http://localhost:3001/api/yandex/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirect_uri: redirectUri,
        }),
        credentials: 'include', // ✅ ВАЖНО: отправляем и принимаем куки
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Ошибка: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Успешный вход через Яндекс:', data);

      return data;
    } catch (error) {
      console.error('❌ Ошибка OAuth входа:', error);
      throw error;
    }
  }

  async getCurrentUser(signal?: AbortSignal): Promise<User> {
    const response = await authApiInstance.get('/api/v2/auth/user', {
      signal,
      useProxy: true,
    });

    return convertKeysToCamelCase(response) as unknown as User;
  }

  async logout(): Promise<unknown> {
    console.log('📤 Выход из системы');

    // ✅ isAppHost: true - запрос к вашему серверу
    const response = await serverApi.post('/logout', {});

    console.log('📥 Выход выполнен');

    return response;
  }

  async checkSession(): Promise<any> {
    try {
      const response = await fetch('http://localhost:3001/api/session-check', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('📊 Данные сессии:', data);

      return data;
    } catch (error) {
      console.error('❌ Ошибка проверки сессии:', error);
      throw error;
    }
  }
}

export const authApi = new AuthApi();
