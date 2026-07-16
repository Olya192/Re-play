import { Router } from 'express';
import { ForumAPI } from '../controllers/forum-api';

export const forumRoutes = (router: Router) => {
  const forumRouter = Router();

  forumRouter.get('/:id', ForumAPI.find);
  forumRouter.get('/', ForumAPI.getAll);
  forumRouter.post('/', ForumAPI.create);

  router.use('/api/forum', forumRouter);
};
