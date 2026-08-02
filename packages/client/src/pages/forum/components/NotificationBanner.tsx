import { useState } from 'react';
import { Alert, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { getPermission, requestPermission } from '@/utils/notificationService';

export const NotificationBanner = () => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    getPermission()
  );

  const handleRequest = async () => {
    const result = await requestPermission();

    setPermission(result);
  };

  if (permission === 'granted' || permission === 'unsupported') {
    return null;
  }

  if (permission === 'denied') {
    return (
      <Alert
        type="info"
        showIcon
        message="Уведомления заблокированы"
        description="Разрешите уведомления в настройках браузера, чтобы получать оповещения о новых ответах."
      />
    );
  }

  return (
    <Alert
      type="info"
      showIcon
      icon={<BellOutlined />}
      message="Уведомления о новых ответах"
      description="Включите, чтобы получать оповещения, когда кто-то ответит в вашем топике, а вкладка свёрнута."
      action={
        <Button size="small" type="primary" onClick={handleRequest}>
          Включить
        </Button>
      }
    />
  );
};
