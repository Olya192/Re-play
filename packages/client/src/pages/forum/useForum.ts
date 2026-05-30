import { useEffect, useState } from 'react';
import { forumApi } from '../../api/forumApi';
import { ForumTopicItem } from '../../types/forum';

export const useForum = () => {
  const [forumTopicItems, setForumTopicItems] = useState<ForumTopicItem[] | []>([]);

  const getForumTopics = async () => {
    try {
      return await forumApi.getForumTopics();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getForumTopics().then((response) => {
      if (response) {
        console.log(response);
        // setForumTopicItems(response);
      }
    });
  }, []);

  return {
    forumTopicItems,
  };
};
