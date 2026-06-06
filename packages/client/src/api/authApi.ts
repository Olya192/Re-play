import { convertKeysToCamelCase } from '../utils/convert/convertKeysToCamelCase';
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

const authApiInstance = new HTTPTransport();

class AuthApi {
  signup(data: SignupData): Promise<{ id: number }> {
    return authApiInstance.post('/api/v2/auth/signup', {
      data: { ...data },
    });
  }

  signin(data: SigninData) {
    return authApiInstance.post('/api/v2/auth/signin', {
      data: { ...data },
    });
  }

  async getCurrentUser(): Promise<User> {
    const response = await authApiInstance.get('/api/v2/auth/user');

    return convertKeysToCamelCase(response) as unknown as User;
  }
}

export const authApi = new AuthApi();
