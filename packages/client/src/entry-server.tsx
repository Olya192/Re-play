import React from 'react';
import ReactDOM from 'react-dom/server';
import { Provider } from 'react-redux';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import { Request as ExpressRequest } from 'express';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';
import { matchRoutes } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { createContext, createFetchRequest, createUrl } from './entry-server.utils';
import { reducer } from './store';
import { routes, CustomRouteObject } from './routes';
import './index.css';
import { setPageHasBeenInitializedOnServer } from './slices/ssrSlice';

export const render = async (req: ExpressRequest) => {
  const { query, dataRoutes } = createStaticHandler(routes);
  const fetchRequest = createFetchRequest(req);
  const context = await query(fetchRequest);

  if (context instanceof Response) {
    throw context;
  }

  const store = configureStore({
    reducer,
  });

  const url = createUrl(req);

  const foundRoutes = matchRoutes(routes, url);

  if (!foundRoutes) {
    throw new Error('Страница не найдена!');
  }

  // Собираем fetchData всех совпавших роутов (включая вложенные/leaf), а не только первого совпадения:
  // у защищённых роутов первым идёт ProtectedRoute обёртка без fetchData,
  // из-за чего data-init самой страницы на сервере не запускался
  const ctx = createContext(req);

  try {
    await Promise.all(
      foundRoutes
        .map(({ route }) => (route as CustomRouteObject).fetchData)
        .filter((fetchData): fetchData is NonNullable<typeof fetchData> => Boolean(fetchData))
        .map((fetchData) =>
          fetchData({
            dispatch: store.dispatch,
            state: store.getState(),
            ctx,
          })
        )
    );
  } catch (e) {
    console.log('Инициализация страницы произошла с ошибкой', e);
  }

  store.dispatch(setPageHasBeenInitializedOnServer(true));

  const router = createStaticRouter(dataRoutes, context);

  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = ReactDOM.renderToString(
    <HelmetProvider context={helmetContext}>
      <Provider store={store}>
        <StaticRouterProvider router={router} context={context} />
      </Provider>
    </HelmetProvider>
  );

  const helmet = helmetContext.helmet;

  return {
    html,
    helmet,
    initialState: store.getState(),
  };
};
