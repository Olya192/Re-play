import { useState } from 'react';
import { leaderboardApi } from '../../api/leaderboardApi';
import { authApi } from '../../api/authApi';

export const useLeaderboard = () => {
  const [loading, setLoading] = useState(false);

  const getLeaderboard = async (cursor: number, perPage: number) => {
    setLoading(true);
    try {
      return await leaderboardApi
        .getLeaderboard({
          ratingFieldName: 'score',
          cursor: cursor,
          limit: perPage,
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.warn('error:', error);
    }
  };

  const addToLeaderboard = async (score: number) => {
    const user = await authApi.getCurrentUser();
    try {
      return await leaderboardApi.addToLeaderboard({
        data: {
          id: new Date().getTime(),
          key: new Date().getTime(),
          userName: user.firstName,
          userId: user.id,
          score: score,
          teamName: 'Re:play',
        },
        ratingFieldName: 'score',
        teamName: 'Re:play',
      });
    } catch (error) {
      console.warn('error:', error);
    }
  };

  return {
    loading,
    getLeaderboard,
    addToLeaderboard,
  };
};
