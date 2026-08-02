import { ErrorHandler } from '@/utils/error/errorHandler';

const MAX_TITLE_LENGTH = 60;

const MAX_BODY_LENGTH = 120;

const isBrowserEnvironment = (): boolean => typeof window !== 'undefined';

const isNotificationSupported = (): boolean => isBrowserEnvironment() && 'Notification' in window;

export const getPermission = (): NotificationPermission | 'unsupported' => {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  return Notification.permission;
};

export const requestPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();

    return permission;
  } catch (error) {
    ErrorHandler.logBackgroundError(error, 'request permission');

    return 'denied';
  }
};

export const showNotification = (title: string, body: string): boolean => {
  if (!isNotificationSupported()) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    const safeTitle = title.slice(0, MAX_TITLE_LENGTH);

    const safeBody = body.slice(0, MAX_BODY_LENGTH);

    const notification = new Notification(safeTitle, {
      body: safeBody,
      icon: '/vite.svg',
      tag: `forum-${Date.now()}`,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return true;
  } catch (error) {
    ErrorHandler.logBackgroundError(error, 'show notification');

    return false;
  }
};

export const isTabHidden = (): boolean => {
  if (!isBrowserEnvironment()) {
    return false;
  }

  return document.hidden;
};
