export interface Topic {
  id: number;
  title: string;
  content: string;
}

export interface ForumResponse {
  id: number;
  theme_id: number;
  owner_id: number;
  device: string | null;
  theme: Topic;
}

export const API_URL = '/api';

export const fetchTopics = async (): Promise<Topic[]> => {
  const response = await fetch(`${API_URL}/forum`);

  if (!response.ok) {
    throw new Error(`Failed to fetch topics: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const fetchTopic = async (topicId: number): Promise<Topic> => {
  const response = await fetch(`${API_URL}/forum/${topicId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch topics: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// export const fetchUserTheme = async (
//   userId: number,
//   device?: string
// ): Promise<UserThemeResponse | null> => {
//   const params = new URLSearchParams({ userId: userId.toString() });
//
//   if (device) {
//     params.append('device', device);
//   }
//
//   const response = await fetch(`${API_URL}/themes/user/theme?${params}`);
//
//   if (!response.ok) {
//     throw new Error(`Failed to fetch user theme: ${response.status}`);
//   }
//
//   const data = await response.json();
//
//   return data;
// };

// export const setUserTheme = async (
//   userId: number,
//   themeId: number,
//   device?: string
// ): Promise<UserThemeResponse> => {
//   const response = await fetch(`${API_URL}/themes/user/theme`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ userId, themeId, device }),
//   });
//
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new Error(errorData.error || `Failed to set user theme: ${response.status}`);
//   }
//
//   return response.json();
// };
