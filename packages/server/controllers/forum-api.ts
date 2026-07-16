import { Request, Response } from 'express';
import { ForumService } from '../services/forum.service';
import { ForumCommentsService } from '../services/forumComments.service';

const forumService = new ForumService();
const forumCommentsService = new ForumCommentsService();

export class ForumAPI {
  public static create = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log(555, req.body);
      const newTopic = await forumService.create(req.body);
      res.status(201).json(newTopic);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create topic' });
    }
  };

  public static getAll = async (_: Request, res: Response): Promise<void> => {
    try {
      const allTopics = await forumService.findAll();
      res.status(200).json(allTopics);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get all topics' });
    }
  };

  public static find = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const normalizedId = Number(id) || undefined;

      const topic = await forumService.find({
        id: normalizedId,
      });

      if (!topic) {
        res.status(404).json({ error: 'Topic not found' });

        return;
      }

      let comments = null;

      if (topic) {
        comments = await forumCommentsService.find({
          id: normalizedId,
        });
      }

      res.json({
        topic: topic,
        comments: comments,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to find topic' });
    }
  };

  public static getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const normalizedId = Number(id) || undefined;

      const topic = await forumService.find({ id: normalizedId });
      const topicComments = await forumCommentsService.find({ id: normalizedId });

      console.log(topicComments);

      if (!topic) {
        res.status(404).json({ error: 'Topic not found' });

        return;
      }

      res.json(topic);
    } catch (error) {
      res.status(500).json({ error: 'Failed to find topic' });
    }
  };

  public static update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const normalizedId = Number(id);

      if (isNaN(normalizedId)) {
        res.status(400).json({ error: 'Invalid id format' });

        return;
      }

      const updatedTopic = await forumService.update(normalizedId, req.body);

      if (!updatedTopic) {
        res.status(404).json({ error: 'Topic not found' });

        return;
      }

      res.json(updatedTopic);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  };

  public static delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const normalizedId = Number(id);

      if (isNaN(normalizedId)) {
        res.status(400).json({ error: 'Invalid id format' });

        return;
      }

      const result = await forumService.delete(normalizedId);
      res.status(200).json({ success: result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete topic' });
    }
  };
}
