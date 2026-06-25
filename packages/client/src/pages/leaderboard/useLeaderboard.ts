import { useState } from 'react';
import { leaderboardApi } from '../../api/leaderboardApi';
import { useSelector } from '../../store';
import { getUser } from '../../slices/userSlice';
import { authApi } from '../../api/authApi';

export const useLeaderboard = () => {
  const [loading, setLoading] = useState(false);
  const user = useSelector(getUser);

  const getLeaderboard = async (page: number) => {
    setLoading(true);
    try {
      return await leaderboardApi.getLeaderboard({
        ratingFieldName: 'score',
        cursor: page,
        limit: 10,
      });
    } catch (error) {
      console.warn('error:', error);
    }
  };

  const addToLeaderboard = async (score: number) => {
    setLoading(true);
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
