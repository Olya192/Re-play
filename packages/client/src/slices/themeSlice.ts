import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchThemes, fetchUserTheme, setUserTheme, Theme } from '../api/themeApi';

interface ThemeState {
  availableThemes: Theme[];
  currentTheme: Theme | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  isThemeChangePending: boolean;
}

const initialState: ThemeState = {
  availableThemes: [],
  currentTheme: null,
  status: 'idle',
  error: null,
  isThemeChangePending: false,
};

export const loadThemeData = createAsyncThunk(
  'theme/loadThemeData',
  async (userId: number | undefined, { rejectWithValue }) => {
    try {
      const themes = await fetchThemes();
      const userThemeRes = userId ? await fetchUserTheme(userId) : null;
      const savedTheme =
        typeof window !== 'undefined' ? window.localStorage.getItem('preferred-theme') : null;
      const currentTheme =
        userThemeRes?.theme ||
        (userThemeRes ? themes.find((t) => t.id === userThemeRes.theme_id) || null : null) ||
        (savedTheme ? themes.find((t) => t.theme === savedTheme) || null : null);

      return { availableThemes: themes, currentTheme };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load themes';

      return rejectWithValue(message);
    }
  }
);

export const changeUserTheme = createAsyncThunk(
  'theme/changeUserTheme',
  async ({ userId, themeId }: { userId: number; themeId: number }, { rejectWithValue }) => {
    try {
      const res = await setUserTheme(userId, themeId);

      return { theme: res.theme };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to change theme';

      return rejectWithValue(message);
    }
  }
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeOptimistic: (state, action: PayloadAction<Theme>) => {
      state.currentTheme = action.payload;
      state.isThemeChangePending = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadThemeData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadThemeData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.availableThemes = action.payload.availableThemes;

        if (!state.isThemeChangePending) {
          state.currentTheme = action.payload.currentTheme;
        }
      })
      .addCase(loadThemeData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isThemeChangePending = false;
      })
      .addCase(changeUserTheme.fulfilled, (state, action) => {
        state.currentTheme = action.payload.theme ?? state.currentTheme;
        state.isThemeChangePending = false;
      })
      .addCase(changeUserTheme.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isThemeChangePending = false;
      });
  },
});

export const { setThemeOptimistic } = themeSlice.actions;

export default themeSlice.reducer;
