import { ForumComments } from '../models/ForumComments';

interface CreateRequest {
  title: string;
  content: string;
}

type UpdateRequest = Partial<CreateRequest>;

export class ForumCommentsService {
  public find = async (params: { id?: number }): Promise<ForumComments[]> => {
    if (params.id != null) {
      return await ForumComments.findAll({
        where: {
          topicId: params.id,
        },
      });
    }

    return [];
  };

  public findAll = async (): Promise<ForumComments[]> => {
    return await ForumComments.findAll();
  };

  public create = async (data: {
    userId: number;
    topicId: number;
    content: string;
  }): Promise<ForumComments> => {
    const userId = data.userId;
    const topicId = data.topicId;
    const content = data.content;

    const [comment] = await ForumComments.findOrCreate({
      where: { userId },
      defaults: { userId, topicId, content },
    });

    return comment;
  };

  public update = async (id: number, data: UpdateRequest): Promise<ForumComments | null> => {
    const [affectedCount, affectedRows] = await ForumComments.update(data, {
      where: { id },
      returning: true,
    });

    if (affectedCount === 0 || !affectedRows || affectedRows.length === 0) {
      return null;
    }

    return affectedRows[0];
  };

  public delete = async (id: number): Promise<boolean> => {
    const deletedCount = await ForumComments.destroy({ where: { id } });

    return deletedCount > 0;
  };
}
