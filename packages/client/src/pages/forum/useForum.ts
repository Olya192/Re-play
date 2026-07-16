import { useState } from 'react';
import { fetchTopic, fetchTopics } from '@/api/forumApi';
import { User } from '@/types/user';

export interface topic {
  id: number;
  content: string;
  createdAt: string;
  deletedAt: string;
  title: string;
  updatedAt: string;
  user?: User;
}

export interface comment {
  id: number;
  content: string;
  createdAt: string;
  deletedAt: string;
  topicId: number;
  updatedAt: string;
  userId: number;
  user?: User;
}

export const useForum = () => {
  const [loading, setLoading] = useState(false);

  const getTopics = async (): Promise<topic[]> => {
    setLoading(true);
    let resp: topic[] = [];

    await fetchTopics().then((response) => {
      setLoading(false);
      resp = response as topic[];
    });

    return resp;
  };
  const getTopic = async (topicId: number): Promise<topic[]> => {
    setLoading(true);
    let resp: topic[] = [];

    await fetchTopic(topicId).then((response) => {
      setLoading(false);
      resp = response;
    });

    return resp;
  };

  return {
    loading,
    getTopics,
    getTopic,
  };
};
