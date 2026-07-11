import { Router } from 'express';
import { emojisRoutes } from './emojis-routes';

const router: Router = Router();

emojisRoutes(router);

export default router;
