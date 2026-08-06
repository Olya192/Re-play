import { Comment } from '@/pages/forum/components/ForumComments';

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

export const fetchTopicComments = async (topicId: number): Promise<Topic> => {
  const response = await fetch(`${API_URL}/forum/${topicId}/comments`);

  if (!response.ok) {
    throw new Error(`Failed to fetch topics: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const createTopic = async (
  title: string,
  content: string,
  login: string
): Promise<Topic> => {
  const data = {
    title: title,
    content: content,
    login: login,
  };

  const response = await fetch(`${API_URL}/forum`, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch topics: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const createTopicComment = async (
  commentText: string,
  topicId: number,
  login: string
): Promise<Comment> => {
  const data = {
    commentText: commentText,
    topicId: topicId,
    login: login,
  };

  const response = await fetch(`${API_URL}/forum/${topicId}`, {
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch topics: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
