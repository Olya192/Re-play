// api/apiInstances.ts
import { HTTPTransport } from './httpTransport';

// ✅ URL вашего сервера (порт 3001)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
console.log('🔧 Server API URL:', API_URL);

// Экземпляр для вашего сервера (порт 3001)
export const serverApi = new HTTPTransport(API_URL);

// Экземпляр для внешнего API (Практикум)
export const externalApi = new HTTPTransport('https://ya-praktikum.tech');
