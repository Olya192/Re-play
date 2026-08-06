import { useEffect, useRef, useCallback } from 'react';
import { fetchTopicComments } from '@/api/forumApi';
import { showNotification, isTabHidden, getPermission } from '@/utils/notificationService';
import { ErrorHandler } from '@/utils/error/errorHandler';

const POLL_INTERVAL_MS = 30_000;

const SSE_URL = '/api/forum/events';

interface ForumSseEvent {
  type: 'comment' | 'reaction';
  topicId: number;
  author: string;
  timestamp: number;
}

interface PollComment {
  createdAt: string;
  user?: { displayName?: string };
}

export const useForumNotifications = (topicId: number | undefined): void => {
  const lastCheckedRef = useRef<string>(new Date().toISOString());
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current !== null) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  const startPolling = useCallback(() => {
    if (pollIntervalRef.current !== null || topicId === undefined) {
      return;
    }

    pollIntervalRef.current = setInterval(async () => {
      if (!isTabHidden()) {
        return;
      }

      try {
        const comments = (await fetchTopicComments(topicId)) as unknown as PollComment[];

        const newComments = comments.filter((c) => c.createdAt > lastCheckedRef.current);

        if (newComments.length > 0) {
          lastCheckedRef.current = new Date().toISOString();

          const author = newComments[0]?.user?.displayName ?? 'Кто-то';

          const body =
            newComments.length === 1
              ? `${author} ответил(а) в вашем топике`
              : `${author} и ещё ${newComments.length - 1} ответили в вашем топике`;

          showNotification('Новый ответ на форуме', body);
        }
      } catch (error) {
        ErrorHandler.logBackgroundError(error, 'forum polling');
      }
    }, POLL_INTERVAL_MS);
  }, [topicId]);

  useEffect(() => {
    if (typeof window === 'undefined' || topicId === undefined) {
      return;
    }

    const es = new EventSource(SSE_URL);

    es.onopen = () => {
      stopPolling();
    };

    es.onmessage = (event: MessageEvent) => {
      if (getPermission() !== 'granted') {
        return;
      }

      try {
        const data: ForumSseEvent = JSON.parse(event.data as string);

        if (data.topicId !== topicId) {
          return;
        }

        if (!isTabHidden()) {
          return;
        }

        const title = data.type === 'comment' ? 'Новый ответ на форуме' : 'Новая реакция';

        const body =
          data.type === 'comment'
            ? `${data.author} ответил(а) в вашем топике`
            : `${data.author} отреагировал(а) на ваш топик`;

        showNotification(title, body);
      } catch (error) {
        ErrorHandler.logBackgroundError(error, 'SSE parse');
      }
    };

    es.onerror = () => {
      startPolling();
    };

    return () => {
      es.close();
      stopPolling();
    };
  }, [topicId, startPolling, stopPolling]);
};
