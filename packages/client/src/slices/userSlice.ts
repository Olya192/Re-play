import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { authApi } from '../api/authApi';

// Используйте тот же интерфейс, что и в authApi
export interface User {
  id: number;
  firstName: string;
  secondName: string;
  displayName: string;
  login: string;
  email: string;
  phone: string;
  avatar: string;
}

export type UserStatus = 'idle' | 'loading' | 'success' | 'error';

export interface UserState {
  data: User | null;
  status: UserStatus;
}

const initialState: UserState = {
  data: null,
  status: 'idle',
};

export const fetchUserThunk = createAsyncThunk(
  'user/fetchUserThunk',
  async (_: void, { signal }) => {
    const user = await authApi.getCurrentUser(signal);

    return user;
  },
  {
    // Не запускаем повторный запрос, только если пользователь уже загружен.
    // Не блокируем по 'loading': под StrictMode эффект монтируется дважды,
    // первый запрос отменяется abort'ом, и второй должен успеть выполниться.
    condition: (_arg, { getState }) => {
      return !(getState() as RootState).user.data;
    },
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.data = action.payload;
      state.status = action.payload ? 'success' : 'idle';
    },
    clearUser: (state) => {
      state.data = null;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.pending, (state) => {
        state.data = null;
        state.status = 'loading';
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = 'success';
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        // Отмена (размонтирование / StrictMode) — это не ошибка авторизации:
        // иначе поздний abort перезатёр бы успешный результат повторного запроса.
        if (action.meta.aborted) {
          return;
        }

        state.status = 'error';
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.data;

export const selectUserStatus = (state: RootState) => state.user.status;

export default userSlice.reducer;
