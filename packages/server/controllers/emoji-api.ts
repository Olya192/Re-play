import { Request, Response } from 'express';
import { EmojiService } from '../services/emoji.service';
import { validateText } from '../utils/validation';

const emojiService = new EmojiService();

export class EmojiAPI {
  public static create = async (req: Request, res: Response): Promise<void> => {
    try {
      const emoji = validateText(req.body.emoji, 'emoji', 16);

      const description = validateText(req.body.description, 'description', 100);

      const newEmoji = await emojiService.create({
        emoji,
        description,
      });

      res.status(201).json(newEmoji);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create emoji' });
    }
  };

  public static getAll = async (_: Request, res: Response): Promise<void> => {
    try {
      const allEmojis = await emojiService.getAll();
      res.status(201).json(allEmojis);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get all emojis' });
    }
  };

  public static find = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, description } = req.query;
      const normalizedId = Number(id) || undefined;
      const normalizedDescription =
        description && typeof description === 'string' ? description : undefined;

      const emoji = await emojiService.find({
        id: normalizedId,
        description: normalizedDescription,
      });

      if (!emoji) {
        res.status(404).json({ error: 'Emoji not found' });

        return;
      }

      res.json(emoji);
    } catch (error) {
      res.status(500).json({ error: 'Failed to find theme' });
    }
  };

  public static getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const normalizedId = Number(id) || undefined;

      const emoji = await emojiService.find({
        id: normalizedId,
      });

      if (!emoji) {
        res.status(404).json({ error: 'Emoji not found' });

        return;
      }

      res.json(emoji);
    } catch (error) {
      res.status(500).json({ error: 'Failed to find theme' });
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

      const data: {
        emoji?: string;
        description?: string;
      } = {};

      if (req.body.emoji !== undefined) {
        data.emoji = validateText(req.body.emoji, 'emoji', 16);
      }

      if (req.body.description !== undefined) {
        data.description = validateText(req.body.description, 'description', 100);
      }

      if (Object.keys(data).length === 0) {
        res.status(400).json({ error: 'No fields to update' });

        return;
      }

      const updatedEmoji = await emojiService.update(normalizedId, data);

      if (!updatedEmoji) {
        res.status(404).json({ error: 'Emoji not found' });

        return;
      }

      res.json(updatedEmoji);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update emoji' });
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

      const response = await emojiService.delete(normalizedId);

      if (!response) {
        // или if (!deletedCount)
        res.status(404).json({ error: 'Emoji not found' });

        return;
      }

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete emojis' });
    }
  };
}
