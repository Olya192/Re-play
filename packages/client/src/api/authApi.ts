import { AUTH_ROUTES } from '@/constants/api/apiConstants';
import { convertKeysToCamelCase } from '@/utils/convert/convertKeysToCamelCase';
import { HTTPTransport } from './httpTransport';

interface SignupData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

type ServiceID = {
  service_id: string;
};

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
    return authApiInstance.post(AUTH_ROUTES.SIGNUP, {
      data: { ...data },
    });
  }

  signin(data: SigninData): Promise<unknown> {
    return authApiInstance.post(AUTH_ROUTES.SIGNIN, {
      data: { ...data },
    });
  }

  logout(): Promise<unknown> {
    return authApiInstance.post(AUTH_ROUTES.LOGOUT);
  }

  async getCurrentUser(signal?: AbortSignal): Promise<User> {
    const response = await authApiInstance.get(AUTH_ROUTES.USER, { signal });

    return convertKeysToCamelCase(response) as unknown as User;
  }

  async getServiceID(redirectUri: string): Promise<string> {
    const response = await fetch(
      encodeURI(
        `https://ya-praktikum.tech/api/v2/oauth/yandex/service-id?redirect_uri=${redirectUri}`
      )
    );

    const data: ServiceID = await response.json();

    return data.service_id;
  }

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<unknown> {
    return authApiInstance.post(AUTH_ROUTES.OAUTH_TOKEN, {
      data: {
        code,
        redirect_uri: redirectUri,
      },
    });
  }
}

export const authApi = new AuthApi();
