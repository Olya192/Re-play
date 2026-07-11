import { Emojis } from '../models/emojis';
import { type Attributes, type CreateOptions, Op } from 'sequelize';
import { BaseRestService } from './base-rest.service';
import type { Model } from 'sequelize-typescript';

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
  implements BaseRestService<CreateRequest, UpdateRequest, FindRequest, Emojis>
{
  public getAll = async (): Promise<Emojis[]> => {
    return await Emojis.findAll();
  };

  public create = (
    data: CreateRequest
  ): Promise<
    CreateOptions<Attributes<Model>> extends { returning: false } | { ignoreDuplicates: true }
      ? void
      : Emojis
  > => {
    return Emojis.create(data);
  };

  public find = async ({ id, description }: FindRequest): Promise<Emojis | null> => {
    if (id) {
      return await Emojis.findByPk(id);
    }

    if (description) {
      return await Emojis.findOne({
        where: {
          description: { [Op.iLike]: `%${description}%` },
        },
      });
    }

    return null;
  };

  public update = async (id: number, data: UpdateRequest): Promise<Emojis | null> => {
    const [affectedCount] = await Emojis.update(data, { where: { id } });

    if (affectedCount === 0) {
      return null;
    }

    return await this.find({ id });
  };

  public delete = async (id: number) => {
    const deleted = await Emojis.destroy({ where: { id } });

    return deleted > 0;
  };
}
