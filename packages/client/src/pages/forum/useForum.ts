interface topic {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  messages: Array<unknown>;
  messagesCount: number;
  creatorId: number;
}

interface UseForum {
  topicsList: topic[];
}

export const useForum = (): UseForum => {
  return {
    topicsList: [],
  };
};
