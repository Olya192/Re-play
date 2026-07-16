import { Router } from 'express';
import { emojisRoutes } from './emojis-routes';
import { usersRoutes } from './users-routes';
import { themeRoutes } from './themeRoutes';
import { forumRoutes } from './forum-routes';

const router: Router = Router();

emojisRoutes(router);
usersRoutes(router);
themeRoutes(router);
forumRoutes(router);

export default router;
