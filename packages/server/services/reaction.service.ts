import { User } from '../models/User';
import { Reaction } from '../models/Reaction';
import { Emoji } from '../models/Emoji';
import { BaseRestService } from './base-rest.service';

interface CreateRequest {
  user_id: number;
  topic_id: number;
  reaction_id: number;
}

interface DeleteRequest {
  user_id: number;
  topic_id: number;
}

type UpdateRequest = Partial<CreateRequest>;

interface FindRequest {
  topic_id?: number;
}

export class ReactionService
  implements BaseRestService<CreateRequest, UpdateRequest, FindRequest, Reaction>
{
  public find = async (params: FindRequest): Promise<Reaction[]> => {
    const { topic_id } = params;

    if (topic_id === undefined || topic_id === null) {
      return [];
    }

    return await Reaction.findAll({
      where: { topic_id },
      include: [
        { model: User, as: 'user' },
        { model: Emoji, as: 'emoji' },
      ],
    });
  };

  public create = async (data: {
    topic_id: number;
    user_id: number;
    reaction_id: number;
  }): Promise<Reaction> => {
    const [reaction] = await Reaction.upsert(data);

    await reaction.reload({
      include: [
        { model: User, as: 'user' },
        { model: Emoji, as: 'emoji' },
      ],
    });

    return reaction;
  };

  public update = async (id: number, data: UpdateRequest): Promise<Reaction | null> => {
    const [affectedCount, affectedRows] = await Reaction.update(data, {
      where: { id },
      returning: true,
    });

    if (affectedCount === 0 || !affectedRows || affectedRows.length === 0) {
      return null;
    }

    return affectedRows[0];
  };

  public deleteByComposite = async ({ topic_id, user_id }: DeleteRequest): Promise<boolean> => {
    const deletedCount = await Reaction.destroy({ where: { topic_id, user_id } });

    return deletedCount > 0;
  };
}
