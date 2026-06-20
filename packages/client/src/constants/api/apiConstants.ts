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
  USER: '/api/v2/auth/user',
  OAUTH: '/oauth/yandex/service-id',
} as const;

export const RESOURCE_API_URL = '/api/v2/resources';
