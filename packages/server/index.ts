import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { createClientAndConnect } from './db';
import { startApp } from './db/startApp';
import router from './router/router';
import { notFound } from './middleware/notFound';
import { authMiddleware } from './middleware/auth';

dotenv.config();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  // TODO добавить прод
];

const app = express();
const port = Number(process.env.SERVER_PORT) || 3001;

// --- 1. Middleware ---
app.use(
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
);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET || 'your-cookie-secret'));

createClientAndConnect();

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', (req, res, next) => {
  if (req.path === '/yandex/service-id' || req.path === '/yandex/login') {
    return next();
  }

  return authMiddleware(req, res, next);
});

app
  .disable('x-powered-by')
  .enable('trust proxy')
  .set('query parser', 'extended')
  .use(router)
  .use(notFound);

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)');
});

(async () => {
  try {
    console.log('  ➜ 🎸 Database ready');
    await startApp();

    app.listen(port, () => {
      console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
})();
