import React from 'react';
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
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker успешно зарегистрирован: ', registration.scope);
      })
      .catch((error) => {
        console.log('Ошибка при регистрации Service Worker: ', error);
      });
  });
}

ReactDOM.hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <HelmetProvider>
    <Provider store={store}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </Provider>
  </HelmetProvider>
);
