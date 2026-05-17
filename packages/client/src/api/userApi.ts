import { HTTPTransport } from './httpTransport';

const userApiInstance = new HTTPTransport();

class ProfileApi {
  // TODO здесь будут запросы на обновление пароля и аватара
  // Текущие запросы - тестовы

  signin(data: Record<string, unknown>) {
    return userApiInstance.post('/api/v2/auth/signin', {
      data: { ...data },
    });
  }

  request() {
    return userApiInstance.get('/api/v2/auth/user');
  }
}

export const profileApi = new ProfileApi();
