import { Forum } from '../models/Forum';

interface CreateRequest {
  title: string;
  content: string;
}

type UpdateRequest = Partial<CreateRequest>;

export class ForumService {
  public find = async (params: { id?: number }): Promise<Forum | null> => {
    if (params.id != null) {
      return await Forum.findByPk(params.id);
    }

    return null;
  };

  public findAll = async (): Promise<Forum[]> => {
    return await Forum.findAll();
  };

  public create = async (data: { title: string; content: string }): Promise<Forum> => {
    const title = data.title.trim();
    const content = data.content.trim();

    const [topic] = await Forum.findOrCreate({
      where: { title },
      defaults: { title, content },
    });

    return topic;
  };

  public update = async (id: number, data: UpdateRequest): Promise<Forum | null> => {
    const [affectedCount, affectedRows] = await Forum.update(data, {
      where: { id },
      returning: true,
    });

    if (affectedCount === 0 || !affectedRows || affectedRows.length === 0) {
      return null;
    }

    return affectedRows[0];
  };

  public delete = async (id: number): Promise<boolean> => {
    const deletedCount = await Forum.destroy({ where: { id } });

    return deletedCount > 0;
  };
}
