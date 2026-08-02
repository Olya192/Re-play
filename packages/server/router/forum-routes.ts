import { Router } from 'express';
import { ForumAPI } from '../controllers/forum-api';
import { SseService } from '../services/sse.service';

export const forumRoutes = (router: Router) => {
  const forumRouter = Router();

  // topic
  forumRouter.get('/', ForumAPI.getAll);
  forumRouter.post('/', ForumAPI.create);
  forumRouter.get('/events', SseService.attach);
  forumRouter.get('/:id', ForumAPI.find);

  // comments
  forumRouter.get('/:id/comments', ForumAPI.findCmments);
  forumRouter.post('/:id', ForumAPI.createComment);

  router.use('/api/forum', forumRouter);
};
