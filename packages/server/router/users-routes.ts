import { Router } from 'express';
import { UserAPI } from '../controllers/user-api';

export const usersRoutes = (router: Router) => {
  const usersRouter = Router();

  usersRouter
    .post('/', UserAPI.create)
    .get('/', UserAPI.getAll)
    .get('/find', UserAPI.find)
    .get('/:id', UserAPI.getById)
    .put('/:id', UserAPI.update)
    .post('/create-or-update', UserAPI.createOrUpdate)
    .delete('/:id', UserAPI.delete);

  router.use('/users', usersRouter);
};
