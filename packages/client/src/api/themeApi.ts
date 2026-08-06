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

export const API_URL = '/api';

export const fetchThemes = async (): Promise<Theme[]> => {
  const response = await fetch(`${API_URL}/themes`);

  if (!response.ok) {
    throw new Error(`Failed to fetch themes: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const fetchUserTheme = async (
  userId: number,
  device?: string
): Promise<UserThemeResponse | null> => {
  const params = new URLSearchParams({ userId: userId.toString() });

  if (device) {
    params.append('device', device);
  }

  const response = await fetch(`${API_URL}/themes/user/theme?${params}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user theme: ${response.status}`);
  }

  const data = await response.json();

  return data;
};

export const setUserTheme = async (
  userId: number,
  themeId: number,
  device?: string
): Promise<UserThemeResponse> => {
  const response = await fetch(`${API_URL}/themes/user/theme`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, themeId, device }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to set user theme: ${response.status}`);
  }

  return response.json();
};
