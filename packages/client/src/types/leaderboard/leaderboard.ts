export interface LeaderboardItem {
  id: number;
  order: number;
  name: string;
  score: number;
  team: string;
}

export interface LeaderboardRequest {
  ratingFieldName: string;
  cursor: number;
  limit: number;
}

export interface LeaderboardResult {
  data: {
    id: number;
    key: number;
    userName: string;
    userId: number;
    score: number;
    teamName: string;
  };
  ratingFieldName: 'score';
  teamName: string;
}
