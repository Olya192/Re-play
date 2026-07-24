import { Router } from 'express';
import { emojisRoutes } from './emojis-routes';
import { usersRoutes } from './users-routes';
import { themeRoutes } from './themeRoutes';
import { forumRoutes } from './forum-routes';
import { reactionsRoutes } from './reactions-router';

const router: Router = Router();

emojisRoutes(router);
usersRoutes(router);
themeRoutes(router);
forumRoutes(router);
reactionsRoutes(router);

export default router;
