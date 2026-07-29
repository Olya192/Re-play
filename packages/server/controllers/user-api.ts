import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export class UserAPI {
  public static create = async (req: Request, res: Response): Promise<void> => {
    try {
      const newUser = await userService.create(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create user' });
    }
  };

  public static getAll = async (_: Request, res: Response): Promise<void> => {
    try {
      const allUsers = await userService.findAll();
      res.status(200).json(allUsers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get all users' });
    }
  };

  public static find = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, yaId, login, displayName } = req.query;
      const normalizedId = Number(id) || undefined;
      const normalizedYaId = Number(yaId) || undefined;
      const normalizedLogin = login && typeof login === 'string' ? login : undefined;
      const normalizedDisplayName =
        displayName && typeof displayName === 'string' ? displayName : undefined;

      const user = await userService.find({
        id: normalizedId,
        ya_id: normalizedYaId,
        login: normalizedLogin,
        displayName: normalizedDisplayName,
      });

      if (!user) {
        res.status(404).json({ error: 'User not found' });

        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to find user' });
    }
  };

  public static getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const normalizedId = Number(id) || undefined;

      const user = await userService.find({ id: normalizedId });

      if (!user) {
        res.status(404).json({ error: 'User not found' });

        return;
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to find user' });
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

      const updatedUser = await userService.update(normalizedId, req.body);

      if (!updatedUser) {
        res.status(404).json({ error: 'User not found' });

        return;
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
  };

  public static createOrUpdate = async (req: Request, res: Response): Promise<void> => {
    try {
      const [user, created] = await userService.upsert(req.body);
      res.status(created ? 201 : 200).json(user);
    } catch (error) {
      console.error('Error in createOrUpdate:', error);
      res.status(500).json({ error: 'Failed to create or update user' });
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

      const result = await userService.delete(normalizedId);
      res.status(200).json({ success: result });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  };
}
