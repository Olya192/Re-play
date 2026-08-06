import { Router } from 'express';
import { ThemeController } from '../controllers/ThemeController';

export const themeRoutes = (router: Router) => {
  const themeRouter = Router();

  themeRouter.get('/', ThemeController.getAllThemes);
  themeRouter.post('/', ThemeController.createTheme);

  themeRouter.get('/user/theme', ThemeController.getUserTheme);
  themeRouter.put('/user/theme', ThemeController.setUserTheme);

  router.use('/api/themes', themeRouter);
};
