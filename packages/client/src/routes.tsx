import { AppDispatch, RootState } from './store';
import { FriendsPage, initFriendsPage } from './pages/FriendsPage';
import { initLeaderboardPage, LeaderboardPage } from './pages/leaderboard';
import { Error404, initError404 } from './pages/Error404';
import { Error500, initError500 } from './pages/Error500';
import { Error403, initError403 } from './pages/Error403';
import { ForumPage, ForumTopic, initForumPage } from './pages/forum';
import { initProfilePage, ProfilePage } from './pages/profile';
import { GameRoot, initGameRoot } from './features/game';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RouteObject } from 'react-router-dom';
import { ReactNode } from 'react';
import ForumAddTopic from './pages/forum/components/ForumAddTopic';
import { initLogoutPage, LogoutPage } from './pages/LogoutPage';
import { initLoginPage, LoginPage } from './pages/LoginPage';
import { initRegisterPage, RegisterPage } from './pages/RegisterPage';

export type PageInitContext = {
  clientToken?: string;
};

export type PageInitArgs = {
  dispatch: AppDispatch;
  state: RootState;
  ctx: PageInitContext;
};

export type CustomRouteObject = RouteObject & {
  Component?: React.ComponentType<Record<string, unknown>>;
  fetchData?: (args: PageInitArgs) => Promise<unknown>;
};

// Публичные маршруты
const publicRoutes: CustomRouteObject[] = [
  {
    path: '/logout',
    Component: LogoutPage,
    fetchData: initLogoutPage,
  },
  {
    path: '/login',
    Component: LoginPage,
    fetchData: initLoginPage,
  },
  {
    path: '/register',
    Component: RegisterPage,
    fetchData: initRegisterPage,
  },
];

// Защищённые маршруты
/**
 * === GAME новая архитектура ===
 * Концепция: единственный экран — GameRoot. Слоистая
 * мобильная игра, всё игровое UI рисуется поверх Canvas как слои и модалки.
 * В будущих спринтах легаси-роуты нужно мигрировать в URL модалки поверх GameRoot.
 *
 * === LEGACY оставлены пока как есть, нужно превратить в модалки позже ===
 **/
const protectedRoutes: CustomRouteObject[] = [
  {
    path: '/',
    Component: GameRoot,
    fetchData: initGameRoot,
  },

  {
    path: '/friends',
    Component: FriendsPage,
    fetchData: initFriendsPage,
  },
  {
    path: '/profile',
    Component: ProfilePage,
    fetchData: initProfilePage,
  },
  {
    path: '/leaderboard',
    Component: LeaderboardPage,
    fetchData: initLeaderboardPage,
  },
  {
    path: '/forum',
    Component: ForumPage,
    fetchData: initForumPage,
    children: [
      {
        path: ':topicId',
        Component: ForumTopic,
      },
      {
        path: 'add',
        Component: ForumAddTopic,
      },
    ],
  },
  {
    path: '/404',
    Component: Error404,
    fetchData: initError404,
  },
  {
    path: '/500',
    Component: Error500,
    fetchData: initError500,
  },
  {
    path: '/403',
    Component: Error403,
    fetchData: initError403,
  },
  {
    path: '*',
    Component: Error404,
    fetchData: initError404,
  },
];

// Функция для обёртки защищённых маршрутов
const withProtection = (routes: CustomRouteObject[]): CustomRouteObject => ({
  element: (<ProtectedRoute />) as ReactNode,
  children: routes as RouteObject[], // Приводим к RouteObject для children
});

// Итоговые маршруты
export const routes: CustomRouteObject[] = [...publicRoutes, withProtection(protectedRoutes)];
