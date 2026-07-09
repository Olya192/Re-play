// Доступные эмодзи-реакций. Синхронно с бэком форума (см.tmp/forum-api-contract.md):
// бэк валидирует, что пришедший emoji есть в списке, фронт этим же списком рисует палитру выбора
export const AVAILABLE_EMOJI = ['👍', '❤️', '😂', '😮', '😢', '🔥'] as const;

export type AvailableEmoji = (typeof AVAILABLE_EMOJI)[number];
