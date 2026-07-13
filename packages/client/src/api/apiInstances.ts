import { HTTPTransport } from './httpTransport';

// Экземпляр для внешнего API (Практикум)
export const externalApi = new HTTPTransport('https://ya-praktikum.tech');

// Экземпляр для вашего сервера
export const serverApi = new HTTPTransport(
  process.env.REACT_APP_API_URL || 'http://localhost:3001'
);
