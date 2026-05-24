import { HTTPTransport } from './httpTransport';

const userApiInstance = new HTTPTransport();

class LeaderboardApi {
  async getLeaderboard() {
    return await userApiInstance.post('/api/v2/leaderboard/all');
  }
}

export const leaderboardApi = new LeaderboardApi();
