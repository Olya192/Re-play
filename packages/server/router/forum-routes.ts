import { Router } from 'express';
import { ForumAPI } from '../controllers/forum-api';

export const forumRoutes = (router: Router) => {
  const forumRouter = Router();

  // topic
  forumRouter.get('/', ForumAPI.getAll);
  forumRouter.post('/', ForumAPI.create);
  forumRouter.get('/:id', ForumAPI.find);

  // comments
  forumRouter.get('/:id/comments', ForumAPI.findCmments);
  forumRouter.post('/:id', ForumAPI.createComment);

  router.use('/api/forum', forumRouter);
};
