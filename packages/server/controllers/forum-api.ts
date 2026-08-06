import { Request, Response } from 'express';
import { ForumService } from '../services/forum.service';
import { ForumCommentsService } from '../services/forumComments.service';
import { SseService } from '../services/sse.service';
import { validateLogin, validateText } from '../utils/validation';

const forumService = new ForumService();
const forumCommentsService = new ForumCommentsService();

export class ForumAPI {
  public static create = async (req: Request, res: Response): Promise<void> => {
    try {
      const title = validateText(req.body.title, 'title', 255);

      const content = validateText(req.body.content, 'content', 2048);

      const login = validateText(req.body.login, 'login', 20);

      const topic = await forumService.create({
        title,
        content,
        login,
      });

      res.status(201).json(topic);
    } catch (error) {
      res.status(500).json({ error: `Failed to create topic. ${error}` });
    }
  };

  public static createComment = async (req: Request, res: Response): Promise<void> => {
    try {
      const topicId = Number(req.body.topicId);

      if (!Number.isSafeInteger(topicId) || topicId <= 0) {
        res.status(400).json({ error: 'Некорректный идентификатор топика' });

        return;
      }

      const commentText = validateText(req.body.commentText, 'commentText', 500);

      const login = validateLogin(req.body.login);

      const newTopicComment = await forumService.createComment({
        topicId,
        commentText,
        login,
      });

      res.status(201).json(newTopicComment);

      SseService.broadcast({
        type: 'comment',
        topicId,
        author: login,
        timestamp: Date.now(),
      });
    } catch (error) {
      res.status(500).json({ error: `Failed to create topic comment. ${error}` });
    }
  };

  public static getAll = async (_: Request, res: Response): Promise<void> => {
    try {
      const allTopics = await forumService.findAll();
      res.status(200).json(allTopics);
    } catch (error) {
      res.status(500).json({ error: `Failed to get all topics. ${error}` });
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

      res.json(topic);
    } catch (error) {
      res.status(500).json({ error: 'Failed to find topic' });
    }
  };

  public static findComments = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const normalizedId = Number(id) || undefined;

      const comments = await forumCommentsService.find({
        id: normalizedId,
      });

      if (!comments) {
        res.status(404).json({ error: 'Topic not found' });

        return;
      }

      res.json(comments);
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

      if (!Number.isInteger(id) || normalizedId <= 0) {
        res.status(400).json({ error: 'Некорректный идентификатор топика' });

        return;
      }

      const title = validateText(req.body.title, 'title', 255);

      const content = validateText(req.body.content, 'content', 2048);

      const topic = await forumService.update(normalizedId, {
        title,
        content,
      });

      res.json(topic);
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
