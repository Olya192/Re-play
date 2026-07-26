import { Router } from 'express';
import { ReactionAPI } from '../controllers/reaction-api';

export const reactionsRoutes = (router: Router) => {
  const reactionsRouter = Router();

  reactionsRouter
    .get('/', ReactionAPI.find)
    .post('/', ReactionAPI.create)
    .put('/', ReactionAPI.update)
    .post('/delete', ReactionAPI.delete);

  router.use('/api/reactions', reactionsRouter);
};
