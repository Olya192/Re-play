import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { store } from './store';
import { routes } from './routes';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

const router = createBrowserRouter(routes);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    if (import.meta.env.MODE === 'development') {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();

          if ('caches' in window) {
            caches.keys().then((cacheNames) => {
              cacheNames.forEach((cacheName) => {
                caches.delete(cacheName);
                console.log(`Service Worker Кэш удален: ${cacheName}`);
                window.location.reload();
              });
            });
          }
        })
        .then(() => {
          console.log('Service Worker отменен и кэш очищен');
          window.location.reload();
        })
        .catch((error) => {
          console.error('Service Worker: ', error);
        });
    } else {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker успешно зарегистрирован: ', registration.scope);
        })
        .catch((error) => {
          console.error('Ошибка при регистрации Service Worker: ', error);
        });
    }
  });
}

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);
