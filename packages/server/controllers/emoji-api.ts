import { Request, Response } from 'express';
import { EmojiService } from '../services/emoji.service';

const emojiService = new EmojiService();

export class EmojiAPI {
  public static create = async (req: Request, res: Response): Promise<void> => {
    try {
      const newEmoji = await emojiService.create(req.body);
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

      const updatedEmoji = await emojiService.update(normalizedId, req.body);

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
