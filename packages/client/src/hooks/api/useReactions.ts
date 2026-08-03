import { useCallback, useEffect, useMemo, useState } from 'react';
import { emojiApi } from '@/api/emojiApi';
import { topicReactionsApi } from '@/api/topicReactionsApi';
import { userApi } from '@/api/userApi';
import { store } from '@/store';
import { Emoji, ReactionRow, ReactionView } from '@/types/forum';

interface UseReactions {
  reactions: ReactionView[];
  palette: Emoji[];
  canReact: boolean;
  select: (reactionId: number) => Promise<void>;
}

// Справочник эмодзи один на приложение — кэшируем, чтобы не тянуть на каждый бар.
let emojisCache: Emoji[] | null = null;
let emojisPromise: Promise<Emoji[]> | null = null;

const loadEmojis = (): Promise<Emoji[]> => {
  if (emojisCache) {
    return Promise.resolve(emojisCache);
  }

  if (!emojisPromise) {
    emojisPromise = emojiApi
      .getAll()
      .then((list) => {
        emojisCache = list;

        return list;
      })
      .catch((error) => {
        emojisPromise = null;
        throw error;
      });
  }

  return emojisPromise;
};

// app-серверный user_id (не id Практикума) резолвим по login и кэшируем.
const userIdByLogin = new Map<string, number>();

const resolveMyUserId = async (): Promise<number | null> => {
  const login = store.getState().user.data?.login;

  if (!login) {
    return null;
  }

  const cached = userIdByLogin.get(login);

  if (cached !== undefined) {
    return cached;
  }

  try {
    const user = await userApi.findUser(login);

    if (user?.id != null) {
      userIdByLogin.set(login, user.id);

      return user.id;
    }
  } catch (error) {
    console.error(error);
  }

  return null;
};

const aggregate = (
  rows: ReactionRow[],
  emojis: Emoji[],
  myUserId: number | null
): ReactionView[] => {
  const dict = new Map(emojis.map((item) => [item.id, item]));
  const byReaction = new Map<number, ReactionView>();

  for (const row of rows) {
    const reactionId = row.reaction_id;
    const meta = row.emoji ?? dict.get(reactionId);

    const view = byReaction.get(reactionId) ?? {
      reactionId,
      emoji: meta?.emoji ?? '❓',
      description: meta?.description ?? '',
      count: 0,
      reactedByMe: false,
      users: [],
    };

    view.count += 1;

    if (myUserId != null && row.user_id === myUserId) {
      view.reactedByMe = true;
    }

    const name = row.user?.displayName || row.user?.login;

    if (name) {
      view.users.push(name);
    }

    byReaction.set(reactionId, view);
  }

  return Array.from(byReaction.values());
};

export const useReactions = (topicId: number): UseReactions => {
  const [rows, setRows] = useState<ReactionRow[]>([]);
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [myUserId, setMyUserId] = useState<number | null>(null);

  const loadRows = useCallback(async () => {
    const response = await topicReactionsApi.getTopicReactions(topicId).catch((error) => {
      console.error(error);

      return [] as ReactionRow[];
    });

    setRows(response);
  }, [topicId]);

  useEffect(() => {
    let cancelled = false;

    loadEmojis()
      .then((list) => !cancelled && setEmojis(list))
      .catch((error) => console.error(error));

    resolveMyUserId().then((id) => !cancelled && setMyUserId(id));

    loadRows();

    return () => {
      cancelled = true;
    };
  }, [loadRows]);

  const reactions = useMemo(() => aggregate(rows, emojis, myUserId), [rows, emojis, myUserId]);

  const select = async (reactionId: number): Promise<void> => {
    if (myUserId == null) {
      return;
    }

    const mine = reactions.find((reaction) => reaction.reactedByMe);

    try {
      if (mine && mine.reactionId === reactionId) {
        await topicReactionsApi.deleteReaction({ topicId, userId: myUserId });
      } else {
        await topicReactionsApi.createOrUpdateReaction({ topicId, userId: myUserId, reactionId });
      }

      await loadRows();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    reactions,
    palette: emojis,
    canReact: myUserId != null,
    select,
  };
};
