import { AppDispatch, RootState } from './store'

// import { initMainPage, MainPage } from './pages/Main'

import { initFriendsPage, FriendsPage } from './pages/FriendsPage'
import { initNotFoundPage, NotFoundPage } from './pages/NotFound'
import { initMainPage, LoginPage } from './pages/LoginPage'

export type PageInitContext = {
  clientToken?: string
}

export type PageInitArgs = {
  dispatch: AppDispatch
  state: RootState
  ctx: PageInitContext
}

export const routes = [
  {
    path: '/',
    Component: LoginPage,
    fetchData: initMainPage,
  },
  {
    path: '/friends',
    Component: FriendsPage,
    fetchData: initFriendsPage,
  },
  {
    path: '*',
    Component: NotFoundPage,
    fetchData: initNotFoundPage,
  },
]
