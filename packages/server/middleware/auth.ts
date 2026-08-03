// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🔍 Auth middleware проверяет:', req.path);

    // ✅ Проверяем сессионные куки для прокси
    const session = (req as any).session;
    const sessionCookies = session?.yandexCookies;

    if (sessionCookies && sessionCookies.length > 0) {
      console.log('✅ Авторизация через сессионные куки');

      return next();
    }

    // ✅ Проверяем signed cookie
    const userCookie = req.signedCookies?.user;

    if (!userCookie) {
      console.log('❌ Нет авторизации');

      return res.status(401).json({
        error: 'unauthorized',
        message: 'Требуется авторизация. Пожалуйста, войдите через Яндекс.',
      });
    }

    let user;
    try {
      user = typeof userCookie === 'string' ? JSON.parse(userCookie) : userCookie;
    } catch (parseError) {
      console.error('❌ Ошибка парсинга куки:', parseError);

      return res.status(401).json({
        error: 'unauthorized',
        message: 'Неверные данные пользователя',
      });
    }

    if (!user || !user.id) {
      console.log('❌ Невалидные данные пользователя');

      return res.status(401).json({
        error: 'unauthorized',
        message: 'Невалидные данные пользователя',
      });
    }

    (req as any).user = user;
    console.log('✅ Пользователь авторизован через signed cookie:', user.login || user.id);

    return next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);

    return res.status(401).json({
      error: 'unauthorized',
      message: 'Ошибка авторизации',
    });
  }
};
