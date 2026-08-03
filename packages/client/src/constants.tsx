import './client.d';

export const SERVER_HOST =
  typeof window === 'undefined' ? __INTERNAL_SERVER_URL__ : __EXTERNAL_SERVER_URL__;

export const MINUTES_TO_MS = 60 * 1000;
