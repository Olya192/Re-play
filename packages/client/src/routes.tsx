import { AppDispatch, RootState } from './store';
import { initMainPage, MainPage } from './pages/Main';
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
import { ErrorBoundary } from './components/ErrorBoundary';
import { ComponentType } from 'react';

export type PageInitContext = {
  clientToken?: string;
};

export type PageInitArgs = {
  dispatch: AppDispatch;
  state: RootState;
  ctx: PageInitContext;
};

const withErrorBoundary = (Page: ComponentType): ComponentType => {
  return function PageWithErrorBoundary() {
    return (
      <ErrorBoundary>
        <Page />
      </ErrorBoundary>
    );
  };
};

export const routes = [
  {
    path: '/',
    Component: withErrorBoundary(MainPage),
    fetchData: initMainPage,
  },
  {
    path: '/friends',
    Component: withErrorBoundary(FriendsPage),
    fetchData: initFriendsPage,
  },
  {
    path: '/profile',
    Component: withErrorBoundary(ProfilePage),
    fetchData: initProfilePage,
  },
  {
    path: '/login',
    Component: withErrorBoundary(LoginPage),
    fetchData: initLoginPage,
  },
  {
    path: '/register',
    Component: withErrorBoundary(RegisterPage),
    fetchData: initRegisterPage,
  },
  {
    path: '/user-profile',
    Component: withErrorBoundary(UserProfile),
    fetchData: initUserProfile,
  },
  {
    path: '/leaderboard',
    Component: withErrorBoundary(LeaderboardPage),
    fetchData: initLeaderboardPage,
  },
  {
    path: '/forum',
    Component: withErrorBoundary(ForumPage),
    fetchData: initForumPage,
  },
  {
    path: '/game/start',
    Component: withErrorBoundary(GameStartPage),
    fetchData: initGameStartPage,
  },
  {
    path: '/game/end',
    Component: withErrorBoundary(GameEndPage),
    fetchData: initGameEndPage,
  },
  {
    path: '/404',
    Component: withErrorBoundary(Error404),
    fetchData: initError404,
  },
  {
    path: '*',
    Component: withErrorBoundary(Error404),
    fetchData: initError404,
  },
  {
    path: '/500',
    Component: withErrorBoundary(Error500),
    fetchData: initError500,
  },
];
