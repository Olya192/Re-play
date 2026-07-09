export interface ReactionAgg {
  emoji: string;
  count: number;
  reactedByMe: boolean;
  // Кто реагировал — для тултипа при наведении (см. tmp/forum-api-contract.md).
  users?: string[];
}

export interface ReactionsResponse {
  reactions: ReactionAgg[];
}
