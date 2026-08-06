import dotenv from 'dotenv';
dotenv.config();

import type { HelmetServerState } from 'react-helmet-async';
import express, { Request as ExpressRequest } from 'express';
import path from 'path';
import fs from 'fs/promises';
import http from 'http';
import https from 'https';
import serialize from 'serialize-javascript';
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 80;
const clientPath = path.join(__dirname, '..');
const isDev = process.env.NODE_ENV === 'development';

// Куда проксировать /api (форум и пр. относительные запросы клиента).
// В dev/локально — http://localhost:3001, в docker — http://server:3001 (INTERNAL_SERVER_URL).
const backendUrl = process.env.INTERNAL_SERVER_URL || 'http://localhost:3001';

async function createServer() {
  const app = express();

  // При подключении nginx в поле connect-src можно будет убрать значения http://localhost:3001 и ws://localhost:*
  // Требуется проверка в режиме production
  if (!isDev) {
    app.use((_, res, next) => {
      res.setHeader(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "style-src 'self' 'unsafe-inline'",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' https://ya-praktikum.tech data:",
          "connect-src 'self' http://localhost:3001 https://ya-praktikum.tech ws://localhost:*",
        ].join('; ')
      );

      next();
    });
  }

  app.use(cookieParser());

  // Проксируем /api на бэкенд. Vite-proxy из vite.config тут не работает
  // (middleware-режим), поэтому проксируем сами, до SSR-catch-all.
  app.use('/api', (req, res) => {
    const target = new URL(req.originalUrl, backendUrl);
    const transport = target.protocol === 'https:' ? https : http;

    const proxyReq = transport.request(
      target,
      { method: req.method, headers: { ...req.headers, host: target.host } },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );

    proxyReq.on('error', () => {
      if (!res.headersSent) {
        res.status(502).json({ error: 'Bad gateway (api proxy)' });
      }
    });

    req.pipe(proxyReq);
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let vite: any;

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');

    vite = await createViteServer({
      server: { middlewareMode: true },
      root: clientPath,
      appType: 'custom',
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(clientPath, 'dist/client'), { index: false }));
  }

  app.get('/{*splat}', async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Получаем файл client/index.html который мы правили ранее
      // Создаём переменные
      let render: (req: ExpressRequest) => Promise<{
        html: string;
        initialState: unknown;
        helmet: HelmetServerState;
      }>;

      let template: string;

      if (vite) {
        template = await fs.readFile(path.resolve(clientPath, 'index.html'), 'utf-8');

        // Применяем встроенные HTML-преобразования vite и плагинов
        template = await vite.transformIndexHtml(url, template);

        // Загружаем модуль клиента, который писали выше,
        // он будет рендерить HTML-код
        render = (await vite.ssrLoadModule(path.join(clientPath, 'src/entry-server.tsx'))).render;
      } else {
        template = await fs.readFile(path.join(clientPath, 'dist/client/index.html'), 'utf-8');

        // Получаем путь до сбилдженого модуля клиента, чтобы не тащить средства сборки клиента на сервер
        const pathToServer = path.join(clientPath, 'dist/server/entry-server.mjs');

        // Импортируем этот модуль и вызываем с инишл стейтом
        render = (await import(pathToServer)).render;
      }

      // Получаем HTML-строку из JSX
      const { html: appHtml, initialState, helmet } = await render(req);

      // Заменяем комментарий на сгенерированную HTML-строку
      const html = template
        .replace(
          `<!--ssr-helmet-->`,
          `${helmet.meta.toString()} ${helmet.title.toString()} ${helmet.link.toString()}`
        )
        .replace(`<!--ssr-outlet-->`, appHtml)
        .replace(
          `<!--ssr-initial-state-->`,
          `<script>window.APP_INITIAL_STATE = ${serialize(initialState, {
            isJSON: true,
          })}</script>`
        );

      // Завершаем запрос и отдаём HTML-страницу
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      if (vite) {
        vite.ssrFixStacktrace(e as Error);
      }

      next(e);
    }
  });

  app.listen(port, () => {
    console.log(`Client is listening on port: ${port}`);
  });
}

createServer();
