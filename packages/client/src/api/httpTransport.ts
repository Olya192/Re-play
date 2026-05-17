import { METHODS } from '../constants/api/apiConstants';
import { queryStringify } from '../utils/api/queryStringify';

interface Options {
  method: (typeof METHODS)[keyof typeof METHODS];
  headers?: Record<string, string>;
  data?: Record<string, unknown> | FormData;
  timeout?: number;
  [key: string]: unknown;
}

const TIMEOUT = 10000;
const host = 'https://ya-praktikum.tech';

export class HTTPTransport {
  get = (url: string, options: Record<string, unknown> = {}) => {
    return this.request(url, { ...options, method: METHODS.GET });
  };

  post = (url: string, options: Record<string, unknown> = {}) => {
    return this.request(url, { ...options, method: METHODS.POST });
  };

  put = (url: string, options: Record<string, unknown> = {}) => {
    return this.request(url, { ...options, method: METHODS.PUT });
  };

  delete = (url: string, options: Record<string, unknown> = {}) => {
    return this.request(url, { ...options, method: METHODS.DELETE });
  };

  request = async (url: string, options: Options = { method: METHODS.GET }) => {
    const timeout = options.timeout ? options.timeout : TIMEOUT;

    const { method, headers = {}, data } = options;

    const isGet = method === METHODS.GET;
    const isFormData = data instanceof FormData;

    const requestUrl =
      isGet && data && !isFormData ? `${host}${url}${queryStringify(data)}` : `${host}${url}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const fetchHeaders: Record<string, string> = {
      ...headers,
    };

    const fetchOptions: RequestInit = {
      method,
      headers: fetchHeaders,
      signal: controller.signal,
      credentials: 'include',
    };

    if (!isGet && data !== undefined && data !== null) {
      if (data instanceof FormData) {
        fetchOptions.body = data;
      } else {
        fetchOptions.body = JSON.stringify(data);

        if (!fetchHeaders['Content-Type']) {
          fetchHeaders['Content-Type'] = 'application/json';
        }
      }
    }

    try {
      const response = await fetch(requestUrl, fetchOptions);

      if (response.ok) {
        const contentType = response.headers.get('Content-Type') || '';
        let data;

        if (contentType.includes('multipart/form-data')) {
          data = await response.formData();
        } else if (contentType.includes('application/json')) {
          data = await response.json();
        } else if (
          contentType.startsWith('image/') ||
          contentType.startsWith('audio/') ||
          contentType.startsWith('video/')
        ) {
          data = await response.blob();
        } else {
          data = await response.text();
        }

        return data;
      } else {
        // Неуспешный статус (не 2xx)
        const errorResponseText = await response.text();

        console.log('Ошибки нет, статус:', response.status, errorResponseText);
      }
    } catch (error) {
      console.log('Ошибка запроса: ', error);
    } finally {
      clearTimeout(timeoutId);
    }
  };
}
