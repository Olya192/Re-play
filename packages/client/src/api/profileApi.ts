import { HTTPTransport } from './httpTransport';
import { EditPasswordData, User } from '../types/user/user';
import { convertKeysToCamelCase } from '../utils/convert/convertKeysToCamelCase';
import { UserDTO } from '../types/api';

const userApiInstance = new HTTPTransport();

class ProfileApi {
  // TODO здесь будут запросы на обновление пароля и аватара

  // TODO Запрос на получение данных пользователя и вход - перенести в хук для user
  signin(data: Record<string, unknown>) {
    return userApiInstance.post('/api/v2/auth/signin', {
      data: { ...data },
    });
  }

  async request(): Promise<User> {
    const response = await userApiInstance.get('/api/v2/auth/user');

    return convertKeysToCamelCase(response) as unknown as User;
  }

  editPassword(data: EditPasswordData): Promise<string> {
    return userApiInstance.put('/api/v2/user/password', {
      data: { ...data },
    });
  }

  async editAvatar(data: FormData): Promise<User> {
    const response = await userApiInstance.put('/api/v2/user/profile/avatar', {
      data: data,
    });

    return convertKeysToCamelCase(response) as unknown as User;
  }
}

export const profileApi = new ProfileApi();
