import { SiteTheme } from '../models/SiteTheme';
import { UserTheme } from '../models/UserTheme';
import { WhereOptions } from 'sequelize';

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
    const where: WhereOptions<UserTheme> = { owner_id: userId };

    if (device) {
      where.device = device;
    }

    return await UserTheme.findOne({
      where,
      include: [{ model: SiteTheme, as: 'theme' }],
    });
  }

  public static async setUserTheme(data: SetUserThemeRequest) {
    const { userId, themeId, device } = data;

    const existingTheme = await UserTheme.findOne({
      where: { owner_id: userId, device: device || null },
    });

    if (existingTheme) {
      existingTheme.theme_id = themeId;
      await existingTheme.save();

      return existingTheme;
    } else {
      return await UserTheme.create({
        owner_id: userId,
        theme_id: themeId,
        device: device || null,
      });
    }
  }
}
