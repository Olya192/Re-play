import { AppDispatch, RootState } from './store';
import { initMainPage, MainPage } from './pages/Main';
import { initFriendsPage, FriendsPage } from './pages/FriendsPage';
import { initNotFoundPage, NotFoundPage } from './pages/NotFound';
import { initLeaderboardPage, LeaderboardPage } from './pages/leaderboard';

export type PageInitContext = {
  clientToken?: string;
};

export type PageInitArgs = {
  dispatch: AppDispatch;
  state: RootState;
  ctx: PageInitContext;
};

export const routes = [
  {
    path: '/',
    Component: MainPage,
    fetchData: initMainPage,
  },
  {
    path: '/friends',
    Component: FriendsPage,
    fetchData: initFriendsPage,
  },
  {
    path: '/leaderboard',
    Component: LeaderboardPage,
    fetchData: initLeaderboardPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
];
