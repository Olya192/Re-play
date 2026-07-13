export const BASE_API_URL = 'https://ya-praktikum.tech';

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

export const AUTH_ROUTES = {
  SIGNUP: '/api/v2/auth/signup',
  SIGNIN: '/api/v2/auth/signin',
  LOGOUT: '/api/v2/auth/logout',
  USER: '/api/v2/auth/user',
  OAUTH: '/oauth/yandex/service-id',
  OAUTH_TOKEN: '/api/v2/oauth/yandex',
} as const;

export const RESOURCE_API_URL = '/api/v2/resources';

export const SERVER_ROUTES = {
  ME: '/api/me',
  FRIENDS: '/api/friends',
  USER: '/api/user',
  PROFILE: '/api/profile',
  LOGOUT: '/api/logout',
  YANDEX_SERVICE_ID: '/api/yandex/service-id',
  YANDEX_LOGIN: '/api/yandex/login',
};
