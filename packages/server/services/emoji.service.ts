import { type Attributes, type CreateOptions, Op } from 'sequelize';
import type { Model } from 'sequelize-typescript';
import { Emoji } from '../models/Emoji';
import { BaseRestService } from './base-rest.service';

interface FindRequest {
  id?: number;
  description?: string;
}

interface CreateRequest {
  emoji: string;
  description: string;
}

type UpdateRequest = Partial<CreateRequest>;

export class EmojiService
  implements BaseRestService<CreateRequest, UpdateRequest, FindRequest, Emoji>
{
  public getAll = async (): Promise<Emoji[]> => {
    return await Emoji.findAll();
  };

  public create = (
    data: CreateRequest
  ): Promise<
    CreateOptions<Attributes<Model>> extends { returning: false } | { ignoreDuplicates: true }
      ? void
      : Emoji
  > => {
    return Emoji.create(data);
  };

  public find = async ({ id, description }: FindRequest): Promise<Emoji | null> => {
    if (id !== undefined && id != null) {
      return await Emoji.findByPk(id);
    }

    const escaped = description && description.replace(/[%_]/g, '\\$&');

    if (description) {
      return await Emoji.findOne({
        where: {
          description: { [Op.iLike]: `%${escaped}%` },
        },
      });
    }

    return null;
  };

  public update = async (id: number, data: UpdateRequest): Promise<Emoji | null> => {
    const [affectedCount, affectedRows] = await Emoji.update(data, {
      where: { id },
      returning: true,
    });

    if (affectedCount === 0) {
      return null;
    }

    return affectedRows[0];
  };

  public delete = async (id: number) => {
    const deleted = await Emoji.destroy({ where: { id } });

    return deleted > 0;
  };
}
