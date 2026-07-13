import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Используем any для обхода проблемы с типами
  const session = (req as any).session;

  if (!session || !session.user) {
    return res.status(401).json({
      error: 'unauthorized',
      message: 'Требуется авторизация. Пожалуйста, войдите через Яндекс.',
    });
  }

  // Сохраняем пользователя в req.user
  (req as any).user = session.user;

  return next();
};
