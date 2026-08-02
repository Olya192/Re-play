import { Request, Response } from 'express';
import { ReactionService } from '../services/reaction.service';
import { SseService } from '../services/sse.service';

const reactionService = new ReactionService();

export class ReactionAPI {
  public static create = async (req: Request, res: Response): Promise<void> => {
    try {
      const newReaction = await reactionService.create(req.body);
      res.status(201).json(newReaction);

      const author =
        (newReaction as { user?: { displayName?: string } }).user?.displayName ?? 'Кто-то';

      SseService.broadcast({
        type: 'reaction',
        topicId: Number(req.body.topic_id),
        author,
        timestamp: Date.now(),
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create reaction' });
    }
  };

  public static find = async (req: Request, res: Response): Promise<void> => {
    try {
      const { topic_id } = req.query;
      const normalizedId = Number(topic_id) || undefined;

      const reactions = await reactionService.find({
        topic_id: normalizedId,
      });

      res.json(reactions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to find reactions' });
    }
  };

  public static update = async (req: Request, res: Response): Promise<void> => {
    try {
      const updatedReaction = await reactionService.update(req.body.id, req.body);

      if (!updatedReaction) {
        res.status(404).json({ error: 'Reaction not found' });

        return;
      }

      res.json(updatedReaction);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update reactions' });
    }
  };

  public static delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id, topic_id } = req.body;
      const normalizedUserId = Number(user_id);
      const normalizedTopicId = Number(topic_id);

      if (isNaN(normalizedUserId) || isNaN(normalizedTopicId)) {
        res.status(400).json({ error: 'Invalid id format' });

        return;
      }

      const response = await reactionService.deleteByComposite({
        user_id: normalizedUserId,
        topic_id: normalizedTopicId,
      });

      if (!response) {
        res.status(404).json({ error: 'Reaction not found' });

        return;
      }

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete reaction' });
    }
  };
}
