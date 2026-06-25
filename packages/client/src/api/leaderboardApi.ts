import { HTTPTransport } from './httpTransport';
import { LeaderboardRequest, LeaderboardResult } from '../types/leaderboard';

const userApiInstance = new HTTPTransport();

class LeaderboardApi {
  async getLeaderboard(data: LeaderboardRequest) {
    return await userApiInstance.post('/api/v2/leaderboard/Re%3Aplay', { data: { ...data } });
  }
  async addToLeaderboard(data: LeaderboardResult) {
    return await userApiInstance.post('/api/v2/leaderboard', { data: { ...data } });
  }
}

export const leaderboardApi = new LeaderboardApi();
