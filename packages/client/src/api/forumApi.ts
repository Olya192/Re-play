import { HTTPTransport } from './httpTransport';

const userApiInstance = new HTTPTransport();

class ForumApi {
  async getForumTopics() {
    // return await userApiInstance.post('/api/v2/leaderboard/all');
    return 'Нет бэка, нет проблем';
  }
}

export const forumApi = new ForumApi();
