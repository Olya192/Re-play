// oauth-routes.ts
import { Router } from 'express';
import axios from 'axios';

export const oauthRoutes = (router: Router) => {
  const oauthRouter = Router();

  // 1. OAuth логин (публичный)
  oauthRouter.post('/yandex/login', async (req, res) => {
    const { code, redirect_uri } = req.body;

    if (!code || !redirect_uri) {
      return res.status(400).json({ error: 'code and redirect_uri required' });
    }

    try {
      console.log('🔄 Обмен code через API практикума...');

      const authResponse = await axios.post(
        'https://ya-praktikum.tech/api/v2/oauth/yandex',
        { code, redirect_uri },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const setCookieHeader = authResponse.headers['set-cookie'];

      if (!setCookieHeader || setCookieHeader.length === 0) {
        return res.status(500).json({ error: 'No cookie received' });
      }

      console.log('📦 Получены куки от Яндекс:', setCookieHeader);

      // ✅ Сохраняем ВСЕ куки в сессию
      const session = (req as any).session || {};
      session.yandexCookies = setCookieHeader;
      session.isAuthenticated = true;
      (req as any).session = session;

      // Сохраняем сессию
      await new Promise((resolve, reject) => {
        if (typeof session.save === 'function') {
          session.save((err: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(true);
            }
          });
        } else {
          resolve(true);
        }
      });

      console.log('✅ Сессия сохранена');
      console.log('🍪 Куки в сессии:', setCookieHeader);

      return res.json({
        success: true,
        message: 'OAuth login successful',
      });
    } catch (error) {
      console.error('❌ Ошибка OAuth:', error);

      if (axios.isAxiosError(error)) {
        return res.status(error.response?.status || 500).json({
          error: 'OAuth failed',
          details: error.response?.data,
        });
      }

      return res.status(500).json({ error: 'OAuth failed' });
    }
  });

  oauthRouter.all('/proxy/:path(*)', async (req, res) => {
    try {
      const session = (req as any).session;
      const yandexCookies = session?.yandexCookies;

      if (!yandexCookies || yandexCookies.length === 0) {
        return res.status(401).json({
          error: 'Not authenticated',
          needLogin: true,
        });
      }

      // ✅ Формируем строку из ВСЕХ кук (только значения)
      const cookieValues = yandexCookies.map((c: string) => c.split(';')[0]);
      const cookieString = cookieValues.join('; ');

      console.log('📤 Отправляем все куки:', cookieString);

      const url = `https://ya-praktikum.tech/api/v2/${req.params.path}`;

      // ✅ Добавляем больше заголовков
      const response = await axios({
        method: req.method as any,
        url: url,
        data: req.body,
        params: req.query,
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieString,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/json, text/plain, */*',
          'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
          Origin: 'https://ya-praktikum.tech',
          Referer: 'https://ya-praktikum.tech/',
        },
        withCredentials: true,
      });

      console.log('✅ Прокси успешен, статус:', response.status);

      return res.status(response.status).json(response.data);
    } catch (error) {
      console.error('❌ Прокси ошибка:', error);

      if (axios.isAxiosError(error)) {
        console.error('❌ Статус ошибки:', error.response?.status);
        console.error('❌ Данные ошибки:', error.response?.data);

        if (error.response?.status === 401) {
          return res.status(401).json({
            error: 'Session expired',
            needLogin: true,
            details: error.response?.data,
          });
        }

        return res.status(error.response?.status || 500).json({
          error: 'Proxy failed',
          details: error.response?.data,
        });
      }

      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  // 3. Получение service_id (публичный)
  oauthRouter.get('/yandex/service-id', async (req, res) => {
    try {
      const { redirect_uri } = req.query;

      if (!redirect_uri) {
        return res.status(400).json({ error: 'redirect_uri required' });
      }

      console.log('📤 Запрос service_id для:', redirect_uri);

      const response = await axios.get(
        `https://ya-praktikum.tech/api/v2/oauth/yandex/service-id?redirect_uri=${encodeURIComponent(
          redirect_uri as string
        )}`
      );

      return res.json(response.data);
    } catch (error) {
      console.error('❌ Ошибка получения service_id:', error);

      if (axios.isAxiosError(error)) {
        return res.status(error.response?.status || 500).json({
          error: 'Failed to get service_id',
          details: error.response?.data,
        });
      }

      return res.status(500).json({ error: 'Failed to get service_id' });
    }
  });

  // 4. Проверка сессии (для отладки)
  oauthRouter.get('/session-check', async (req, res) => {
    const session = (req as any).session;
    console.log('🔍 Проверка сессии:', session);

    return res.json({
      hasSession: !!session,
      hasCookies: !!(session?.yandexCookies && session.yandexCookies.length > 0),
      sessionId: (req as any).sessionID,
      cookies: session?.yandexCookies || [],
      cookiesCount: session?.yandexCookies?.length || 0,
    });
  });

  router.use('/api', oauthRouter);
};
