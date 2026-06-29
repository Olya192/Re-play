import { useState } from 'react';
import { leaderboardApi } from '../../api/leaderboardApi';
import { authApi } from '../../api/authApi';

export const useLeaderboard = () => {
  const [loading, setLoading] = useState(false);

  const getLeaderboard = async (cursor: number, perPage: number) => {
    setLoading(true);
    let resp = [];
    await leaderboardApi
      .getLeaderboard({
        ratingFieldName: 'score',
        cursor: cursor,
        limit: perPage,
      })
      .then((response) => {
        setLoading(false);
        resp = response;
      })
      .catch((error) => {
        console.warn('error:', error);
        setLoading(false);
      });

    return resp;
  };

  const addToLeaderboard = async (score: number) => {
    const user = await authApi.getCurrentUser();
    try {
      const id = new Date().getTime();

      return await leaderboardApi.addToLeaderboard({
        data: {
          id: id,
          key: id,
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
