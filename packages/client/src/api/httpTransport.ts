import { METHODS } from '../constants/api/apiConstants';
import { queryStringify } from '../utils/api/queryStringify';

interface Options {
  method: (typeof METHODS)[keyof typeof METHODS];
  headers?: Record<string, string>;
  data?: Record<string, unknown> | FormData;
  timeout?: number;
  signal?: AbortSignal;
  host?: string;
}

type RequestOptions = Omit<Options, 'method'>;

const TIMEOUT = 10000;

// Хост для внешнего API (Практикум)
const DEFAULT_HOST = 'https://ya-praktikum.tech';

export class HTTPTransport {
  private baseHost: string;

  constructor(host?: string) {
    this.baseHost = host || DEFAULT_HOST;
  }

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
    const { method, headers = {}, data, signal, host } = options;

    const baseHost = host || this.baseHost;

    const isGet = method === METHODS.GET;
    const isFormData = data instanceof FormData;

    const requestUrl =
      isGet && data && !isFormData ? `${host}${url}${queryStringify(data)}` : `${host}${url}`;

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
        const errorResponseText = await response.text();

        const error = new Error(
          `Запрос завершен со статусом: ${response.status}, ${errorResponseText}`
        );
        (error as any).status = response.status;
        (error as any).responseText = errorResponseText;

        throw error;
      }
    } catch (error) {
      console.error('HTTP Transport error:', error);
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  };
}
