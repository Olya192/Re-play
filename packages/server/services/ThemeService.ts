import { sequelize } from '../db';
import { SiteTheme } from '../models/SiteTheme';
import { UserTheme } from '../models/UserTheme';
import { WhereOptions, Transaction } from 'sequelize';

export interface CreateThemeRequest {
  theme: string;
  description: string;
}

export interface SetUserThemeRequest {
  userId: number;
  themeId: number;
  device?: string;
}

export class ThemeService {
  private static normalizeDevice(device?: string) {
    return device ?? null;
  }

  public static async getAllThemes() {
    return await SiteTheme.findAll();
  }

  public static async getThemeById(id: number) {
    return await SiteTheme.findByPk(id);
  }

  public static async createTheme(data: CreateThemeRequest) {
    return await SiteTheme.create({
      theme: data.theme,
      description: data.description,
    });
  }

  public static async getUserTheme(userId: number, device?: string) {
    const where: WhereOptions<UserTheme> = {
      owner_id: userId,
      device: ThemeService.normalizeDevice(device),
    };

    return await UserTheme.findOne({
      where,
      include: [{ model: SiteTheme, as: 'theme' }],
    });
  }

  public static async setUserTheme(data: SetUserThemeRequest) {
    const { userId, themeId, device } = data;
    const deviceValue = ThemeService.normalizeDevice(device);

    return await sequelize.transaction(async (t: Transaction) => {
      const existing = await UserTheme.findOne({
        where: { owner_id: userId, device: deviceValue },
        lock: t.LOCK.UPDATE,
        transaction: t,
      });

      if (existing) {
        await existing.update({ theme_id: themeId }, { transaction: t });
      } else {
        await UserTheme.create(
          { owner_id: userId, theme_id: themeId, device: deviceValue },
          { transaction: t }
        );
      }

      return await UserTheme.findOne({
        where: { owner_id: userId, device: deviceValue },
        include: [{ model: SiteTheme, as: 'theme' }],
        transaction: t,
      });
    });
  }
}
