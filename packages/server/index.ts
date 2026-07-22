import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { createClientAndConnect } from './db';
import { authMiddleware } from './middleware/auth';
import { startApp } from './db/startApp';
import router from './router/router';
import { notFound } from './middleware/notFound';
import { themeRoutes } from './router/themeRoutes';

dotenv.config();

const app = express();
const port = Number(process.env.SERVER_PORT) || 3001;

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());

app.use(cookieParser());

createClientAndConnect();

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/yandex/service-id', async (req, res) => {
  try {
    const redirectUri = req.query.redirect_uri as string;

    if (!redirectUri) {
      return res.status(400).json({ error: 'redirect_uri required' });
    }

    return res.json({
      service_id: process.env.YANDEX_CLIENT_ID,
    });
  } catch (error) {
    console.error('Error getting service ID:', error);

    return res.status(500).json({ error: 'Failed to get service ID' });
  }
});

app.post('/api/yandex/login', async (req, res) => {
  const { code, redirect_uri } = req.body;

  if (!code || !redirect_uri) {
    return res.status(400).json({ error: 'code and redirect_uri required' });
  }

  try {
    const tokenResponse = await fetch('https://oauth.yandex.ru/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.YANDEX_CLIENT_ID!,
        client_secret: process.env.YANDEX_CLIENT_SECRET!,
        redirect_uri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Yandex token error:', errorText);

      return res.status(400).json({ error: 'Failed to exchange code for token' });
    }

    const tokenData: any = await tokenResponse.json();

    if (!tokenData.access_token) {
      return res.status(400).json({ error: 'Invalid token response' });
    }

    const userResponse = await fetch('https://login.yandex.ru/info', {
      headers: {
        Authorization: `OAuth ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Yandex user info error:', errorText);

      return res.status(400).json({ error: 'Failed to get user info' });
    }

    const userData: any = await userResponse.json();

    if (!userData.id) {
      return res.status(400).json({ error: 'Invalid user data' });
    }

    const user = {
      id: userData.id,
      name: userData.display_name || userData.login || 'Пользователь',
      email: userData.default_email || '',
      avatar: userData.default_avatar_id
        ? `https://avatars.yandex.net/get-yapic/${userData.default_avatar_id}/islands-200`
        : null,
      login: userData.login,
    };

    // Сохраняем пользователя в куку
    res.cookie('user', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 часа
      sameSite: 'lax',
      signed: true, // Подписываем куку для защиты
    });

    console.log('User logged in:', user);

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('OAuth error:', error);

    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/logout', (_req, res) => {
  res.clearCookie('user');

  return res.json({ success: true });
});

app.use('/api', (req, res, next) => {
  if (req.path === '/yandex/service-id' || req.path === '/yandex/login') {
    return next();
  }

  return authMiddleware(req, res, next);
});

app.get('/api/me', authMiddleware, (req: any, res) => {
  return res.json(req.user);
});

app.get('/api/friends', authMiddleware, (_req: any, res) => {
  return res.json([
    { name: 'Саша', secondName: 'Панов' },
    { name: 'Лёша', secondName: 'Садовников' },
    { name: 'Серёжа', secondName: 'Иванов' },
  ]);
});

app.get('/api/user', authMiddleware, (req: any, res) => {
  return res.json({
    name: 'Степа',
    secondName: 'Степанов',
    user: req.user,
  });
});

app.get('/api/profile', authMiddleware, (req: any, res) => {
  return res.json({
    message: 'Ваш профиль',
    user: req.user,
  });
});

app.get('/', (_, res) => {
  res.json('👋 Howdy from the server :)');
});

app
  .disable('x-powered-by')
  .enable('trust proxy')
  .set('query parser', 'extended')
  .use(router)
  .use(notFound);

(async () => {
  try {
    console.log('  ➜ 🎸 Database ready');

    themeRoutes(app);
    await startApp();

    app.listen(port, () => {
      console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
  }
})();
