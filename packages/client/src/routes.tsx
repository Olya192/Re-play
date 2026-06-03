import { AppDispatch, RootState } from './store';
import { initFriendsPage, FriendsPage } from './pages/FriendsPage';
import { initLoginPage, LoginPage } from './pages/LoginPage';
import { initRegisterPage, RegisterPage } from './pages/RegisterPage';
import { initUserProfile, UserProfile } from './pages/UserProfile';
import { initLeaderboardPage, LeaderboardPage } from './pages/LeaderboardPage';
import { initForumPage, ForumPage } from './pages/ForumPage';
import { initGameStartPage, GameStartPage } from './pages/GameStartPage';
import { initGameEndPage, GameEndPage } from './pages/GameEndPage';
import { initError404, Error404 } from './pages/Error404';
import { initError500, Error500 } from './pages/Error500';
import { initProfilePage, ProfilePage } from './pages/profile';
import { GameRoot, initGameRoot } from './features/game';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ReactNode } from 'react';

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

  // Нужно мигрировать в модалки
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
    path: '/user-profile',
    Component: UserProfile,
    fetchData: initUserProfile,
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

  /** LEGACY: Старт/Энд в модалки - игра всегда жива, остальные можно сотавить  **/
  {
    path: '/game/start',
    Component: GameStartPage,
    fetchData: initGameStartPage,
  },
  {
    path: '/game/end',
    Component: GameEndPage,
    fetchData: initGameEndPage,
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
