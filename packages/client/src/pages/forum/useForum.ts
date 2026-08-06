import { useState } from 'react';
import {
  createTopic,
  createTopicComment,
  fetchTopic,
  fetchTopicComments,
  fetchTopics,
} from '@/api/forumApi';
import { User } from '@/types/user';
import { store } from '@/store';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { Comment } from '@/pages/forum/components/ForumComments';

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

export interface addTopicData {
  title: string;
  content: string;
}

export const useForum = () => {
  const [api, contextHolder] = notification.useNotification();
  const [forumLoading, setForumLoading] = useState(false);
  const [topic, setTopic] = useState([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const navigate = useNavigate();

  const getTopics = async (): Promise<topic[]> => {
    setForumLoading(true);
    let resp: topic[] = [];

    await fetchTopics().then((response) => {
      setForumLoading(false);
      resp = response as topic[];
    });

    return resp;
  };

  const getTopic = async (topicId: number) => {
    setForumLoading(true);

    await fetchTopic(topicId).then((response) => {
      setForumLoading(false);
      setTopic(response);
    });

    return topic;
  };

  const getComments = async (topicId: number) => {
    setForumLoading(true);

    await fetchTopicComments(topicId).then((response) => {
      setForumLoading(false);
      setComments(response);
    });

    return comments;
  };

  const addTopic = async (data: addTopicData) => {
    setForumLoading(true);

    const { title, content } = data;

    const user = store.getState().user.data || { login: 'pup' };

    await createTopic(title, content, user.login).then(() => {
      setForumLoading(false);
      goToList();
    });
  };

  const goToList = () => {
    navigate('/forum');
  };

  const addTopicComment = async (commentText: string, topicId: number) => {
    setForumLoading(true);
    const user = store.getState().user.data || { login: 'pup' };
    await createTopicComment(commentText, topicId, user.login).then((response) => {
      getComments(topicId);
    });
  };

  return {
    forumLoading,
    topic,
    comments,
    getTopics,
    getTopic,
    getComments,
    addTopic,
    goToList,
    addTopicComment,
  };
};
