import { Helmet } from 'react-helmet-async';
import { Header } from '../../components/Header';
import { usePage } from '../../hooks/usePage';

export const ProfilePage = () => {
  usePage({ initPage: initProfilePage });

  return (
    <div className="App">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Профиль</title>
        <meta name="description" content="Профиль" />
      </Helmet>
      <Header />
      Профиль
    </div>
  );
};

export const initProfilePage = () => Promise.resolve();
