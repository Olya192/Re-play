import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';

export const RegisterPage = () => {
  usePage({ initPage: initRegisterPage });

  return (
    <div>
      <Helmet>
        <title>Регистрация</title>
      </Helmet>
      <Header />
      <h1>Регистрация</h1>
      <p>Форма создания аккаунта будет здесь</p>
    </div>
  );
};

export const initRegisterPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
