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

export interface UserState {
  data: User | null;
  isLoading: boolean;
}

const initialState: UserState = {
  data: null,
  isLoading: false,
};

// Обновленный thunk с использованием authApi
export const fetchUserThunk = createAsyncThunk('user/fetchUserThunk', async () => {
  const user = await authApi.getCurrentUser();

  return user;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.data = action.payload;
      state.isLoading = false;
    },
    clearUser: (state) => {
      state.data = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.pending, (state) => {
        state.data = null;
        state.isLoading = true;
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserThunk.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user.data;

export const selectUserLoading = (state: RootState) => state.user.isLoading;

export default userSlice.reducer;
