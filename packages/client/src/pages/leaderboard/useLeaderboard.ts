import { useEffect, useState } from 'react';
import { LeaderboardItem } from '../../types/leaderboard';
import { leaderboardApi } from '../../api/leaderboardApi';

export const useLeaderboard = () => {
  const [leaderboardItems, setLeaderboard] = useState<LeaderboardItem[]>([]);

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        return leaderboardApi.getLeaderboard();
      } catch (error) {
        console.log(error);
      }
    };

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
