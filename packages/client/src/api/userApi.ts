import { SERVER_ROUTES } from '../constants/api/apiConstants';
import { serverApi } from './apiInstances';
import { HTTPTransport } from './httpTransport';

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

const USERS_API_URL = '/users';
const apiInstance = new HTTPTransport();

class UserApi {
  // --- 1. Получение текущего пользователя (с вашего сервера) ---
  async getCurrentUser(signal?: AbortSignal): Promise<User | null> {
    try {
      const response = await serverApi.get(SERVER_ROUTES.ME, { signal });

      return response as User;
    } catch (error) {
      if ((error as any).status === 401) {
        return null;
      }

      throw error;
    }
  }

  // --- 2. Поиск пользователя по логину ---
  async findUser(login: string): Promise<void> {
    const response = await apiInstance.get(`${USERS_API_URL}/find`, {
      data: { login },
      isAppHost: true,
    });

    return response;
  }

  // --- 3. Получение списка друзей ---
  async getFriends(signal?: AbortSignal): Promise<any[]> {
    const response = await serverApi.get(SERVER_ROUTES.FRIENDS, { signal });

    return response as any[];
  }

  // --- 4. Получение профиля ---
  async getProfile(signal?: AbortSignal): Promise<any> {
    const response = await serverApi.get(SERVER_ROUTES.PROFILE, { signal });

    return response;
  }

  // --- 5. Создание или обновление пользователя ---
  async createOrUpdateUser({ login, displayName }: Partial<User>): Promise<void> {
    const response = await apiInstance.post(`${USERS_API_URL}/create-or-update`, {
      data: { login, displayName },
      isAppHost: true,
    });

    return response;
  }
}

export const userApi = new UserApi();
