import { LeaderboardItem } from '../../types/leaderboard/leaderboard';

export const LEADERBOARD_FIELDS: Partial<Record<keyof LeaderboardItem, string>> = {
  order: '#',
  name: 'Имя',
  score: 'Очки',
  team: 'Команда',
} as const;
