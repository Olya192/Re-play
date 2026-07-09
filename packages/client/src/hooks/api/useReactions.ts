import { useEffect, useState } from 'react';
import { forumApi } from '../../api/forumApi';
import { ReactionAgg } from '../../types/forum';

interface UseReactions {
  reactions: ReactionAgg[];
  toggleReaction: (emoji: string) => Promise<void>;
}

const ME_LABEL = 'Вы';

const applyToggle = (list: ReactionAgg[], emoji: string): ReactionAgg[] => {
  const existing = list.find((reaction) => reaction.emoji === emoji);

  if (!existing) {
    return [...list, { emoji, count: 1, reactedByMe: true, users: [ME_LABEL] }];
  }

  return list
    .map((reaction) => {
      if (reaction.emoji !== emoji) {
        return reaction;
      }

      const others = (reaction.users ?? []).filter((user) => user !== ME_LABEL);
      const users = reaction.reactedByMe ? others : [...others, ME_LABEL];

      return { ...reaction, count: users.length, reactedByMe: !reaction.reactedByMe, users };
    })
    .filter((reaction) => reaction.count > 0);
};

export const useReactions = (topicId: number): UseReactions => {
  const [reactions, setReactions] = useState<ReactionAgg[]>([]);

  useEffect(() => {
    let cancelled = false;

    forumApi
      .getReactions(topicId)
      .then((response) => {
        if (!cancelled) {
          setReactions(response.reactions);
        }
      })
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
    };
  }, [topicId]);

  const toggleReaction = async (emoji: string): Promise<void> => {
    setReactions((prev) => applyToggle(prev, emoji));

    try {
      const response = await forumApi.toggleReaction(topicId, emoji);
      setReactions(response.reactions);
    } catch (error) {
      console.error(error);

      // Откат к серверному состоянию при ошибке
      const response = await forumApi.getReactions(topicId).catch(() => null);

      if (response) {
        setReactions(response.reactions);
      }
    }
  };

  return {
    reactions,
    toggleReaction,
  };
};
