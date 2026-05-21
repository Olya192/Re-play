import { HTTPTransport } from './httpTransport';
import { User } from '../types/user/user';
import { convertKeysToCamelCase } from '../utils/convert/convert-keys-to-camel-case';

const userApiInstance = new HTTPTransport();

class ProfileApi {
  // TODO здесь будут запросы на обновление пароля и аватара
  // Текущие запросы - тестовы

  signin(data: Record<string, unknown>) {
    return userApiInstance.post('/api/v2/auth/signin', {
      data: { ...data },
    });
  }

  editAvatar(data: FormData) {
    return userApiInstance.put('/api/v2/user/profile/avatar', {
      data: data,
    });
  }

  async request(): Promise<User> {
    const response = await userApiInstance.get('/api/v2/auth/user');

    return convertKeysToCamelCase(response) as unknown as User;
  }
}

export const profileApi = new ProfileApi();
