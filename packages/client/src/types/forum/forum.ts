// Справочник эмодзи с бэка: GET /emoji
export interface Emoji {
  id: number;
  emoji: string;
  description: string;
}

// Автор реакции (app-серверная сущность User)
export interface ReactionUser {
  id: number;
  login: string;
  displayName: string | null;
}

// Сырая реакция из GET /reactions?topic_id= (с вложенными user и emoji)
export interface ReactionRow {
  id: number;
  user_id: number;
  topic_id: number;
  reaction_id: number;
  user?: ReactionUser;
  emoji?: Emoji;
}

// Агрегат для UI (считаем на клиенте: бэк отдаёт плоский список).
// Модель бэка — single-select: у юзера одна реакция на топик.
export interface ReactionView {
  reactionId: number;
  emoji: string;
  description: string;
  count: number;
  reactedByMe: boolean;
  users: string[];
}
