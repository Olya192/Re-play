import { Router } from 'express';
import { UserAPI } from '../controllers/user-api';

export const usersRoutes = (router: Router) => {
  const usersRouter = Router();

  usersRouter
    .post('/', UserAPI.create)
    .get('/users', UserAPI.getAll)
    .get('/users/find', UserAPI.find)
    .get('/users/:id', UserAPI.getById)
    .put('/users/:id', UserAPI.update)
    .delete('/users/:id', UserAPI.delete);

  router.use('/users', usersRouter);
};
