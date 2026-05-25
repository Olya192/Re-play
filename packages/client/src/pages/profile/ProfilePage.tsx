import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header';
import { usePage } from '../../hooks/usePage';
import { BaseLink } from '../../components/BaseLink';
import s from './Profile.module.css';
import { ReactElement, useEffect, useState } from 'react';
import { PROFILE_FIELDS } from '../../constants/profile/constants';
import { User } from '../../types/user/user';
import { AvatarForm } from '../../components/AvatarForm';
import { useProfile } from './useProfile';
import { EditPasswordForm } from '../../components/EditPasswordForm';

export const ProfilePage = () => {
  usePage({ initPage: initProfilePage });

  const { user, avatarUrl, handleAvatarChange, handleAvatarSubmit } = useProfile();
  const [profileFields, setProfileFields] = useState<ReactElement[] | null>(null);

  const generateFields = (user: User) => {
    const fields = (Object.entries(PROFILE_FIELDS) as [keyof typeof PROFILE_FIELDS, string][]).map(
      ([key, label]) => {
        return (
          <li key={key} className={s.profileItem}>
            <div className={s.profileLabel}>{label}</div>
            <div className={s.profileText}>{user[key]}</div>
          </li>
        );
      }
    );

    return fields;
  };

  useEffect(() => {
    if (user) {
      const fields = generateFields(user);

      setProfileFields(fields);
    }
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
          <h1 className={'s.profileTitle'}>Профиль</h1>
          <BaseLink text="Выход" />
        </div>

        <AvatarForm
          avatarUrl={avatarUrl}
          handleAvatarChange={handleAvatarChange}
          handleAvatarSubmit={handleAvatarSubmit}
        />

        <ul className={s.profile}>{profileFields && profileFields}</ul>

        <EditPasswordForm />
      </section>
    </div>
  );
};

export const initProfilePage = () => Promise.resolve();
