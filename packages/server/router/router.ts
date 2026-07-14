import { Router } from 'express';
import { emojisRoutes } from './emojis-routes';
import { usersRoutes } from './users-routes';
import { themeRoutes } from './themeRoutes';

const router: Router = Router();

emojisRoutes(router);
usersRoutes(router);
themeRoutes(router);

export default router;
