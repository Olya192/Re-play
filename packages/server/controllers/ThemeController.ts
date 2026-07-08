import { Request, Response } from 'express';
import { ThemeService } from '../services/ThemeService';

export class ThemeController {
  public static async getAllThemes(_req: Request, res: Response) {
    try {
      const themes = await ThemeService.getAllThemes();
      res.json(themes);
    } catch (error) {
      console.error('Error fetching themes:', error);
      res.status(500).json({ error: 'Failed to fetch themes' });
    }
  }

  public static async getUserTheme(req: Request, res: Response): Promise<void> {
    try {
      // TоDо: Получить userId из сессии/токена (пока что заглушка)
      const userId = req.query.userId ? Number(req.query.userId) : 1;
      const device = req.query.device as string;

      const userTheme = await ThemeService.getUserTheme(userId, device);

      if (!userTheme) {
        res.json(null);

        return;
      }

      res.json(userTheme);
    } catch (error) {
      console.error('Error fetching user theme:', error);
      res.status(500).json({ error: 'Failed to fetch user theme' });
    }
  }

  public static async setUserTheme(req: Request, res: Response): Promise<void> {
    try {
      // TоDо: Получить userId из сессии/токена (пока что заглушка)
      const userId = req.body.userId || 1;
      const themeId = req.body.themeId;
      const device = req.body.device;

      if (!themeId) {
        res.status(400).json({ error: 'themeId is required' });

        return;
      }

      const userTheme = await ThemeService.setUserTheme({
        userId,
        themeId,
        device,
      });

      res.json(userTheme);
    } catch (error) {
      console.error('Error setting user theme:', error);
      res.status(500).json({ error: 'Failed to set user theme' });
    }
  }

  // POST /themes - создать новую тему (для админки)
  public static async createTheme(req: Request, res: Response): Promise<void> {
    try {
      const { theme, description } = req.body;

      if (!theme || !description) {
        res.status(400).json({ error: 'theme and description are required' });

        return;
      }

      const newTheme = await ThemeService.createTheme({ theme, description });
      res.status(201).json(newTheme);
    } catch (error) {
      console.error('Error creating theme:', error);
      res.status(500).json({ error: 'Failed to create theme' });
    }
  }
}
