import { useEffect, useState } from 'react';
import { LeaderboardItem } from '../../types/leaderboard';
import { leaderboardApi } from '../../api/leaderboardApi';

export const useLeaderboard = () => {
  const [leaderboardItems, setLeaderboard] = useState<LeaderboardItem[] | []>([]);

  const getLeaderboard = async () => {
    try {
      return await leaderboardApi.getLeaderboard();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLeaderboard().then((response) => {
      if (response) {
        setLeaderboard(response);
      }
    });
  }, []);

  return {
    leaderboardItems,
  };
};
