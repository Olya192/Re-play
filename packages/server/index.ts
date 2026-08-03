// index.ts
import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { createClientAndConnect } from './db';
import { startApp } from './db/startApp';
import router from './router/router';
import { notFound } from './middleware/notFound';
import { authMiddleware } from './middleware/auth';
import session from 'express-session';

dotenv.config();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

const app = express();
const port = Number(process.env.SERVER_PORT) || 3001;

// --- 1. Middleware ---
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
  .use(cookieParser(process.env.COOKIE_SECRET || 'your-cookie-secret'));

// ✅ Настройка сессий
app.use(
  // @ts-ignore
  session({
    secret: process.env.COOKIE_SECRET || 'your-cookie-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // для localhost (без HTTPS)
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      sameSite: 'lax',
    },
    name: 'sessionId',
  })
);

// --- 2. Database connection ---
createClientAndConnect();

// --- 3. Health check endpoints ---
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)');
});

// --- 4. Auth middleware для /api routes ---
app.use('/api', (req, res, next) => {
  // Публичные пути (не требуют авторизации)
  const publicPaths = ['/yandex/login', '/yandex/service-id', '/proxy'];
  const isPublic = publicPaths.some((path) => req.path === path || req.path.startsWith(path + '/'));

  if (isPublic) {
    console.log('🔓 Публичный путь, пропускаем:', req.path);

    return next();
  }

  console.log('🔒 Защищенный путь, проверяем авторизацию:', req.path);

  return authMiddleware(req, res, next);
});

// --- 5. Routes ---
app
  .use(router)
  .get('/api/friends', (_, res) => {
    res.json([
      { name: 'Саша', secondName: 'Панов' },
      { name: 'Лёша', secondName: 'Садовников' },
      { name: 'Серёжа', secondName: 'Иванов' },
    ]);
  })
  .use(notFound);

// --- 6. Start server ---
(async () => {
  try {
    await startApp();

    app.listen(port, () => {
      console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
})();
