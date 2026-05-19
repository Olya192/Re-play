import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header';
import { usePage } from '../../hooks/usePage';
import { BaseLink } from '../../components/BaseLink';
import s from './Profile.module.css';
import { ReactElement, useEffect, useState } from 'react';
import { profileApi } from '../../api/profileApi';
import { PROFILE_FIELDS } from '../../constants/profile/constants';
import { User } from '../../types/user/user';
import { BASE_API_URL } from '../../constants/api/apiConstants';
import { AvatarForm } from '../../components/AvatarForm';

export const ProfilePage = () => {
  usePage({ initPage: initProfilePage });

  const [user, setUser] = useState<User | null>(null);
  const [profileFields, setProfileFields] = useState<ReactElement[] | null>(null);

  const generateFields = (user: User) => {
    const inputs = (Object.entries(PROFILE_FIELDS) as [keyof typeof PROFILE_FIELDS, string][]).map(
      ([key, label]) => {
        return (
          <li className={s.profileItem}>
            <div className={s.profileLabel}>{label}</div>
            <div className={s.profileText}>{user[key]}</div>
          </li>
        );
      }
    );

    setProfileFields(inputs);
  };

  useEffect(() => {
    if (user) {
      console.log(user.avatar);
      generateFields(user);
    }
  }, [user]);

  useEffect(() => {
    profileApi.request().then((response) => {
      setUser(response);
      console.log(response);
    });
  }, []);

  const avatarUrl = user?.avatar && `${BASE_API_URL}/api/v2/resources${user.avatar}`;

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

        <AvatarForm avatarUrl={avatarUrl} />

        <ul className={s.profile}>{profileFields && profileFields}</ul>
      </section>
    </div>
  );
};

export const initProfilePage = () => Promise.resolve();
