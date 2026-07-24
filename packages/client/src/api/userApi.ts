import { HTTPTransport } from '@/api/httpTransport';
import { User } from '@/types/user';

export const USERS_API_URL = '/users';

// App-серверная сущность пользователя (id — автоинкремент в нашей БД,
// не совпадает с id Практикума). Нужен, напр., для user_id в реакциях.
export interface AppUser {
  id: number;
  login: string;
  displayName: string | null;
}

const apiInstance = new HTTPTransport();

class UserApi {
  async findUser(login: string): Promise<AppUser | null> {
    const response = await apiInstance.get(`${USERS_API_URL}/find`, {
      data: {
        login,
      },
      isAppHost: true,
    });

    return (response as AppUser) ?? null;
  }

  async createOrUpdateUser({ login, displayName }: Partial<User>): Promise<void> {
    const response = await apiInstance.post(`${USERS_API_URL}/create-or-update`, {
      data: {
        login,
        displayName,
      },
      isAppHost: true,
    });

    return response;
  }
}

export const userApi = new UserApi();
