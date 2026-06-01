import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header';
import { usePage } from '../../hooks/usePage';
import s from './Profile.module.css';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import { PROFILE_FIELDS } from '../../constants/profile/constants';
import { User } from '../../types/user/user';
import { AvatarForm } from '../../components/AvatarForm';
import { useProfile } from './useProfile';
import { EditPasswordForm } from '../../components/EditPasswordForm';

export const ProfilePage = () => {
  usePage({ initPage: initProfilePage });

  const { user, avatarUrl, handleAvatarChange, handleAvatarSubmit } = useProfile();

  const profileFields = useMemo(() => {
    if (!user) {
      return null;
    }

    const fields = (Object.entries(PROFILE_FIELDS) as [keyof typeof PROFILE_FIELDS, string][]).map(
      ([key, label]) => (
        <li key={key} className={s.profileItem}>
          <div className={s.profileLabel}>{label}</div>
          <div className={s.profileText}>{user[key]}</div>
        </li>
      )
    );

    return fields;
  }, [user]);

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
