interface ILeaderboardColumns {
  order: string;
  userName: string;
  score: string;
  teamName: string;
}

export const leaderboardColumns: ILeaderboardColumns = {
  order: '#',
  userName: 'Имя',
  score: 'Очки',
  teamName: 'Команда',
};
