import { Op } from 'sequelize';
import { User } from '../models/User';

interface CreateRequest {
  login: string;
  displayName: string;
}

type UpdateRequest = Partial<CreateRequest>;

const escapeLike = (str: string): string => {
  return str.replace(/[%_]/g, '\\$&');
};

export class UserService {
  public find = async (params: {
    id?: number;
    login?: string;
    displayName?: string;
  }): Promise<User | null> => {
    if (params.id != null) {
      return await User.findByPk(params.id);
    }

    if (params.login) {
      const escaped = escapeLike(params.login.trim());

      return await User.findOne({
        where: {
          login: { [Op.iLike]: `%${escaped}%` },
        },
      });
    }

    if (params.displayName) {
      const escaped = escapeLike(params.displayName.trim());

      return await User.findOne({
        where: {
          displayName: { [Op.iLike]: `%${escaped}%` },
        },
      });
    }

    return null;
  };

  public findAll = async (): Promise<User[]> => {
    return await User.findAll();
  };

  public create = async (data: { login: string; displayName?: string }): Promise<User> => {
    const login = data.login.trim();
    const displayName = data.displayName?.trim() || null;

    const [user] = await User.findOrCreate({
      where: { login },
      defaults: { login, displayName },
    });

    return user;
  };

  public update = async (id: number, data: UpdateRequest): Promise<User | null> => {
    const [affectedCount, affectedRows] = await User.update(data, {
      where: { id },
      returning: true,
    });

    if (affectedCount === 0 || !affectedRows || affectedRows.length === 0) {
      return null;
    }

    return affectedRows[0];
  };

  public upsert = async (data: CreateRequest): Promise<[User, boolean | null]> => {
    return await User.upsert(data);
  };

  public delete = async (id: number): Promise<boolean> => {
    const deletedCount = await User.destroy({ where: { id } });

    return deletedCount > 0;
  };
}
