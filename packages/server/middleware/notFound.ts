import { Request, Response } from 'express';

export const notFound = (req: Request, res: Response) => {
  console.log(req.url);
  res.status(404).json({ error: 'Not Found' });
};
