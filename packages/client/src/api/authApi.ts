import { AUTH_ROUTES, SERVER_ROUTES } from '../constants/api/apiConstants';
import { convertKeysToCamelCase } from '../utils/convert/convertKeysToCamelCase';
import { externalApi, serverApi } from './apiInstances';

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

class AuthApi {
  // запросы к апи практикума

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

  async getServiceIDExternal(redirectUri: string): Promise<string> {
    const response = await externalApi.get(AUTH_ROUTES.OAUTH, {
      data: { redirect_uri: redirectUri },
    });

    return response.service_id;
  }

  async exchangeCodeForTokenExternal(code: string, redirectUri: string): Promise<unknown> {
    return externalApi.post(AUTH_ROUTES.OAUTH_TOKEN, {
      data: {
        code,
        redirect_uri: redirectUri,
      },
    });
  }

  // запросы к нашему серверу

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

  async logout(): Promise<unknown> {
    return serverApi.post(SERVER_ROUTES.LOGOUT);
  }

  async getServiceID(redirectUri: string): Promise<string> {
    const response = await serverApi.get(SERVER_ROUTES.YANDEX_SERVICE_ID, {
      data: { redirect_uri: redirectUri },
    });

    return response.service_id;
  }

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<unknown> {
    return serverApi.post(SERVER_ROUTES.YANDEX_LOGIN, {
      data: {
        code,
        redirect_uri: redirectUri,
      },
    });
  }
}

export const authApi = new AuthApi();
