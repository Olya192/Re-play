import React from 'react';
import { useParams } from 'react-router-dom';
import { useForumNotifications } from '@/hooks/useForumNotifications';

export const withForumNotifications = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const WithForumNotifications: React.FC<P> = (props) => {
    const { topicId } = useParams<{ topicId: string }>();

    useForumNotifications(topicId ? Number(topicId) : undefined);

    return <WrappedComponent {...props} />;
  };

  WithForumNotifications.displayName = `withForumNotifications(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithForumNotifications;
};
