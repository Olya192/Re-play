interface ILeaderboardColumns {
  order: string;
  name: string;
  score: string;
  team: string;
}

export const leaderboardColumns: ILeaderboardColumns = {
  order: '#',
  name: 'Имя',
  score: 'Очки',
  team: 'Команда',
};
