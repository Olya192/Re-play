import { Request, Response } from 'express';
import { ThemeService } from '../services/ThemeService';
import { SiteTheme } from '../models/SiteTheme';

export class ThemeController {
  private static parseOptionalString(value: unknown): string | undefined {
    return typeof value === 'string' && value.trim() !== '' ? value : undefined;
  }

  private static parseRequiredNumber(value: unknown): number | null {
    const parsed = Number(value);

    return Number.isInteger(parsed) ? parsed : null;
  }

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
      // ToDo: Получить userId из сессии/токена (пока что заглушка)
      const userId =
        req.query.userId !== undefined ? ThemeController.parseRequiredNumber(req.query.userId) : 1;
      const device = ThemeController.parseOptionalString(req.query.device);

      if (userId == null) {
        res.status(400).json({ error: 'userId must be a number' });

        return;
      }

      const userTheme = await ThemeService.getUserTheme(userId, device);

      res.json(userTheme ?? null);
    } catch (error) {
      console.error('Error fetching user theme:', error);
      res.status(500).json({ error: 'Failed to fetch user theme' });
    }
  }

  public static async setUserTheme(req: Request, res: Response): Promise<void> {
    try {
      // ToDo: Получить userId из сессии/токена (пока что заглушка)
      const userId =
        req.body.userId !== undefined ? ThemeController.parseRequiredNumber(req.body.userId) : 1;
      const themeId = ThemeController.parseRequiredNumber(req.body.themeId);
      const device = ThemeController.parseOptionalString(req.body.device);

      if (userId == null || themeId == null) {
        res.status(400).json({ error: 'userId and themeId are required' });

        return;
      }

      const themeExists = await SiteTheme.findByPk(themeId);

      if (!themeExists) {
        res.status(404).json({ error: 'Theme not found' });

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

  public static async createTheme(req: Request, res: Response): Promise<void> {
    try {
      const { theme, description } = req.body;

      if (theme == null || description == null) {
        res.status(400).json({ error: 'theme and description are required' });

        return;
      }

      if (typeof theme !== 'string' || typeof description !== 'string') {
        res.status(400).json({ error: 'theme and description must be strings' });

        return;
      }

      const existingTheme = await SiteTheme.findOne({ where: { theme } });

      if (existingTheme) {
        res.status(409).json({ error: 'Theme with this name already exists' });

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
