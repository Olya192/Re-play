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

export type PageInitContext = {
  clientToken?: string;
};

export type PageInitArgs = {
  dispatch: AppDispatch;
  state: RootState;
  ctx: PageInitContext;
};

/**
 * === GAME новая архитектура ===
 * Концепция: единственный экран — GameRoot. Слоистая
 * мобильная игра, всё игровое UI рисуется поверх Canvas как слои и модалки.
 * В будущих спринтах легаси-роуты нужно мигрировать в URL модалки поверх GameRoot.
 *
 * === LEGACY оставлены пока как есть, нужно превратить в модалки позже ===
 **/
export const routes = [
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
    path: '/login',
    Component: LoginPage,
    fetchData: initLoginPage,
  },
  {
    path: '/register',
    Component: RegisterPage,
    fetchData: initRegisterPage,
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
