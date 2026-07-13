import { Router } from 'express';
import { emojisRoutes } from './emojis-routes';
import { usersRoutes } from './users-routes';

const router: Router = Router();

emojisRoutes(router);
usersRoutes(router);

export default router;
