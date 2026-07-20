import { HTTPTransport } from '@/api/httpTransport';

export const TOPIC_REACTIONS_API_URL = '/reactions';

const apiInstance = new HTTPTransport();

interface CreateOrUpdateReaction {
  topicId: number;
  userId: number;
  reactionId: number;
}

// TODO - менять можно и нужно, если требуется. Этот вариант делаю, чтобы проверить бек

class TopicReactionsApi {
  async getTopicReactions(id: number): Promise<void> {
    const response = await apiInstance.get(`${TOPIC_REACTIONS_API_URL}`, {
      data: {
        topic_id: id,
      },
      isAppHost: true,
    });

    return response;
  }

  async createOrUpdateReaction({
    topicId,
    userId,
    reactionId,
  }: CreateOrUpdateReaction): Promise<void> {
    const response = await apiInstance.post(`${TOPIC_REACTIONS_API_URL}`, {
      data: {
        topic_id: topicId,
        user_id: userId,
        reaction_id: reactionId,
      },
      isAppHost: true,
    });

    return response;
  }

  async deleteReaction({ topicId, userId }: Partial<CreateOrUpdateReaction>): Promise<void> {
    const response = await apiInstance.post(`${TOPIC_REACTIONS_API_URL}/delete`, {
      data: {
        topic_id: topicId,
        user_id: userId,
      },
      isAppHost: true,
    });

    return response;
  }
}

export const topicReactionsApi = new TopicReactionsApi();
