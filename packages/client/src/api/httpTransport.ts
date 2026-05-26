import { METHODS } from '../constants/api/apiConstants';
import { queryStringify } from '../utils/api/queryStringify';

interface Options {
  method: (typeof METHODS)[keyof typeof METHODS];
  headers?: Record<string, string>;
  data?: Record<string, unknown> | FormData;
  timeout?: number;
}

type RequestOptions = Omit<Options, 'method'>;

const TIMEOUT = 10000;
const host = 'https://ya-praktikum.tech';

export class HTTPTransport {
  get = (url: string, options: RequestOptions = {}) => {
    return this.request(url, { ...options, method: METHODS.GET });
  };

  post = (url: string, options: RequestOptions = {}) => {
    return this.request(url, { ...options, method: METHODS.POST });
  };

  put = (url: string, options: RequestOptions = {}) => {
    return this.request(url, { ...options, method: METHODS.PUT });
  };

  delete = (url: string, options: RequestOptions = {}) => {
    return this.request(url, { ...options, method: METHODS.DELETE });
  };

  request = async (url: string, options: Options = { method: METHODS.GET }) => {
    const timeout = options.timeout ?? TIMEOUT;

    const { method, headers = {}, data } = options;

    const isGet = method === METHODS.GET;
    const isFormData = data instanceof FormData;

    const requestUrl =
      isGet && data && !isFormData ? `${host}${url}${queryStringify(data)}` : `${host}${url}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort('Запрос превысил допустимое время ожидания'),
      timeout
    );

    const fetchHeaders = new Headers(headers);

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

        if (!fetchHeaders.has('Content-Type')) {
          fetchHeaders.set('Content-Type', 'application/json');
        }
      }
    }

    try {
      const response = await fetch(requestUrl, fetchOptions);

      if (response.ok) {
        const contentType = response.headers.get('Content-Type') || '';
        let data;

        if (contentType.includes('application/json')) {
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

        throw new Error(`Запрос завершен со статусом: ${response.status}, ${errorResponseText}`);
      }
    } catch (error) {
      console.log('Ошибка запроса: ', error);
    } finally {
      clearTimeout(timeoutId);
    }
  };
}
