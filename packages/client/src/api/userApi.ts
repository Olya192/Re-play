import { SERVER_ROUTES } from '../constants/api/apiConstants';
import { serverApi } from './apiInstances';

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

class UserApi {
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

  async getFriends(signal?: AbortSignal): Promise<any[]> {
    const response = await serverApi.get(SERVER_ROUTES.FRIENDS, { signal });

    return response as any[];
  }

  async getProfile(signal?: AbortSignal): Promise<any> {
    const response = await serverApi.get(SERVER_ROUTES.PROFILE, { signal });

    return response;
  }
}

export const userApi = new UserApi();
