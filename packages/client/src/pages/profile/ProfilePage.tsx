import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { usePage } from '@/hooks';
import s from './Profile.module.css';
import { useEffect, useMemo } from 'react';
import { PROFILE_FIELDS } from '@/constants/profile/constants';
import { AvatarForm } from '@/components/AvatarForm';
import { useProfile } from './useProfile';
import { EditPasswordForm } from '@/components/EditPasswordForm';
import { showAllResources } from '@/performanceMonitor';
import { Card, Descriptions } from 'antd';

export const ProfilePage = () => {
  usePage({ initPage: initProfilePage });

  const { user, avatarUrl, handleAvatarChange, handleAvatarSubmit } = useProfile();

  const profileFields = useMemo(() => {
    if (!user) {
      return null;
    }

    const fields = (
      <Card
        title="Данные пользователя"
        variant="outlined"
        style={{ maxWidth: 600, margin: '50px auto' }}
      >
        <Descriptions bordered column={1} size="middle">
          {(Object.entries(PROFILE_FIELDS) as [keyof typeof PROFILE_FIELDS, string][]).map(
            ([key, label]) => (
              <Descriptions.Item key={key} label={label}>
                {user[key] || '—'}
              </Descriptions.Item>
            )
          )}
        </Descriptions>
      </Card>
    );

    return fields;
  }, [user]);

  useEffect(() => {
    showAllResources();
  }, []);

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль</title>
        <meta name="description" content="Профиль" />
      </Helmet>
      <Header />

      <section className={s.profileWrapper}>
        <div className={s.profileHeader}>
          <h1 className={s.profileTitle}>Профиль</h1>
        </div>

        {user && (
          <>
            <AvatarForm
              avatarUrl={avatarUrl}
              handleAvatarChange={handleAvatarChange}
              handleAvatarSubmit={handleAvatarSubmit}
            />

            <ul className={s.profile}>{profileFields}</ul>
            <EditPasswordForm />
          </>
        )}
      </section>
    </div>
  );
};

export const initProfilePage = () => Promise.resolve();
