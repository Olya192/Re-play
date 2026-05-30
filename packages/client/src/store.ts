import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
  TypedUseSelectorHook,
  useStore as useStoreBase,
} from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import friendsReducer from './slices/friendsSlice';
import ssrReducer from './slices/ssrSlice';
import userReducer from './slices/userSlice';
import { gameSessionReducer } from './slices/gameSession';
import { gameUiReducer } from './slices/gameUi';
import {
  loadPersistedGameSession,
  persistGameSessionMiddleware,
} from './middleware/persistGameSession';

// Глобально декларируем в window наш ключик
// и задаем ему тип такой же как у стейта в сторе
declare global {
  interface Window {
    APP_INITIAL_STATE: RootState;
  }
}

export const reducer = combineReducers({
  friends: friendsReducer,
  ssr: ssrReducer,
  user: userReducer,
  gameSession: gameSessionReducer,
  gameUi: gameUiReducer,
});

const buildPreloadedState = (): RootState | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const ssrState = window.APP_INITIAL_STATE;
  const persistedSession = loadPersistedGameSession();

  if (!ssrState) {
    return undefined;
  }

  if (!persistedSession) {
    return ssrState;
  }

  return { ...ssrState, gameSession: persistedSession };
};

export const store = configureStore({
  reducer,
  preloadedState: buildPreloadedState(),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(persistGameSessionMiddleware),
});

export type RootState = ReturnType<typeof reducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = useDispatchBase;

export const useSelector: TypedUseSelectorHook<RootState> = useSelectorBase;

export const useStore: () => typeof store = useStoreBase;
