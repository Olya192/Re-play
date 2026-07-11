export interface Theme {
  id: number;
  theme: string;
  description: string;
}

export interface UserThemeResponse {
  id: number;
  theme_id: number;
  owner_id: number;
  device: string | null;
  theme: Theme;
}

export const DEFAULT_THEMES: Theme[] = [
  { id: 1, theme: 'light', description: 'Light theme' },
  { id: 2, theme: 'dark', description: 'Dark theme' },
];

let mockUserTheme: UserThemeResponse = {
  id: 1,
  theme_id: 1,
  owner_id: 1,
  device: null,
  theme: DEFAULT_THEMES[0],
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const fetchThemes = async (): Promise<Theme[]> => {
  try {
    const response = await fetch(`${API_URL}/themes`);

    if (!response.ok) {
      throw new Error('Failed to fetch themes');
    }

    return response.json();
  } catch (error) {
    console.warn('Backend not available, using mock themes');

    return DEFAULT_THEMES;
  }
};

export const fetchUserTheme = async (userId: number): Promise<UserThemeResponse | null> => {
  try {
    const response = await fetch(`${API_URL}/themes/user/theme?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch user theme');
    }

    return response.json();
  } catch (error) {
    console.warn('Backend not available, using mock user theme');

    return mockUserTheme;
  }
};

export const setUserTheme = async (userId: number, themeId: number): Promise<UserThemeResponse> => {
  try {
    const response = await fetch(`${API_URL}/themes/user/theme`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, themeId }),
    });

    if (!response.ok) {
      throw new Error('Failed to set user theme');
    }

    return response.json();
  } catch (error) {
    console.warn('Backend not available, using mock user theme');

    const theme = DEFAULT_THEMES.find((item) => item.id === themeId) ?? DEFAULT_THEMES[0];

    mockUserTheme = {
      ...mockUserTheme,
      theme_id: themeId,
      theme,
    };

    return mockUserTheme;
  }
};
