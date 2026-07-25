import { Router } from 'express';

export const oauthRoutes = (router: Router) => {
  const oauthRouter = Router();

  // Получение service_id для Яндекса
  oauthRouter.get('/yandex/service-id', async (req, res) => {
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

  // Вход через Яндекс (колбэк)
  oauthRouter.post('/yandex/login', async (req, res) => {
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
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        signed: true,
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

  // Выход
  oauthRouter.post('/logout', (_req, res) => {
    res.clearCookie('user');

    return res.json({ success: true });
  });

  // Подключаем все маршруты с префиксом /api
  router.use('/api', oauthRouter);
};
