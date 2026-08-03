// api/httpTransport.ts
import { METHODS } from '@/constants/api/apiConstants';
import { queryStringify } from '@/utils/api/queryStringify';

interface Options {
  method: (typeof METHODS)[keyof typeof METHODS];
  headers?: Record<string, string>;
  data?: Record<string, unknown> | FormData;
  timeout?: number;
  signal?: AbortSignal;
  useProxy?: boolean; // ✅ Новый флаг
}

type RequestOptions = Omit<Options, 'method'> & {
  useProxy?: boolean;
};

const TIMEOUT = 10000;
const host = 'https://ya-praktikum.tech';
const proxyHost = 'http://localhost:3001/api/proxy'; // ✅ Ваш прокси

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
    const { method, headers = {}, data, signal, useProxy = false } = options;

    const isGet = method === METHODS.GET;
    const isFormData = data instanceof FormData;

    // ✅ Если useProxy = true, все запросы идут через прокси
    let requestUrl: string;

    if (useProxy) {
      // Убираем /api/v2/ из url, так как прокси добавляет его автоматически
      const cleanUrl = url.replace(/^\/api\/v2\//, '');
      requestUrl = `${proxyHost}/${cleanUrl}`;
    } else {
      // Обычный запрос напрямую
      requestUrl =
        isGet && data && !isFormData ? `${host}${url}${queryStringify(data)}` : `${host}${url}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort('Запрос превысил допустимое время ожидания'),
      timeout
    );

    if (signal) {
      if (signal.aborted) {
        controller.abort(signal.reason);
      } else {
        signal.addEventListener('abort', () => controller.abort(signal.reason), { once: true });
      }
    }

    const fetchHeaders = new Headers(headers);

    const fetchOptions: RequestInit = {
      method,
      headers: fetchHeaders,
      signal: controller.signal,
      credentials: 'include', // ✅ Важно для отправки кук
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
        const errorResponseText = await response.text();
        throw new Error(`Запрос завершен со статусом: ${response.status}, ${errorResponseText}`);
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };
}
