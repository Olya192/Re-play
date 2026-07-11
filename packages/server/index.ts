import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
dotenv.config();

import express from 'express';
import { startApp } from './db/startApp';
import router from './router/router';
import { notFound } from './middleware/notFound';

const app = express();

app
  .disable('x-powered-by')
  .enable('trust proxy')
  .set('query parser', 'extended')
  .use(cors())
  .use(cookieParser())
  .use(router)
  .use(notFound);

const port = Number(process.env.SERVER_PORT) || 3001;

app.get('/friends', (_, res) => {
  res.json([
    { name: 'Саша', secondName: 'Панов' },
    { name: 'Лёша', secondName: 'Садовников' },
    { name: 'Серёжа', secondName: 'Иванов' },
  ]);
});

app.get('/user', (_, res) => {
  res.json({ name: '</script>Степа', secondName: 'Степанов' });
});

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)');
});

(async function () {
  await startApp();

  app.listen(port, () => {
    console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
  });
})();
