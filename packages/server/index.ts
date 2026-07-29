import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();

import express from 'express';
import { startApp } from './db/startApp';
import router from './router/router';
import { notFound } from './middleware/notFound';
import * as console from 'console';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  // TODO добавить прод
];

const app = express();

const port = Number(process.env.SERVER_PORT) || 3001;

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)');
});

app
  .disable('x-powered-by')
  .enable('trust proxy')
  .set('query parser', 'extended')
  .use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, false);
        }

        if (allowedOrigins.includes(origin)) {
          callback(null, origin);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .use(express.json())
  .use(cookieParser())
  .use(router)
  .get('/api/friends', (_, res) => {
    res.json([
      { name: 'Саша', secondName: 'Панов' },
      { name: 'Лёша', secondName: 'Садовников' },
      { name: 'Серёжа', secondName: 'Иванов' },
    ]);
  })
  .use(notFound);

(async function () {
  await startApp();

  app.listen(port, () => {
    console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
  });
})();
