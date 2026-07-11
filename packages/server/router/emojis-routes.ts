import { Router } from 'express';
import { EmojiAPI } from '../controllers/emoji-api';

export const emojisRoutes = (router: Router) => {
  const emojisRouter = Router();

  emojisRouter
    .get('/', [], EmojiAPI.getAll)
    .post('/', [], EmojiAPI.create)
    .get('/search', [], EmojiAPI.find)
    .get('/:id', EmojiAPI.getById)
    .put('/:id', [], EmojiAPI.update)
    .delete('/:id', [], EmojiAPI.delete);

  router.use('/emoji', emojisRouter);
};
