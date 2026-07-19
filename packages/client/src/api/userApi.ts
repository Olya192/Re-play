import { HTTPTransport } from '@/api/httpTransport';
import { User } from '@/types/user';

export const USERS_API_URL = '/users';

const apiInstance = new HTTPTransport();

class UserApi {
  async findUser(login: string): Promise<void> {
    const response = await apiInstance.get(`${USERS_API_URL}/users/find`, {
      data: {
        login,
      },
      isAppHost: true,
    });

    return response;
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
