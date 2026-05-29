import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';
import { AuthForm, InputType } from '../components/AuthForm/AuthForm';

const inputsNameLogin: Array<InputType> = [
  {
    type: 'text',
    text: 'введите логин',
    logo: 'введите логин',
  },
  {
    type: 'password',
    text: 'введите пароль',
    logo: 'введите пароль',
  },
];

export const LoginPage = () => {
  usePage({ initPage: initLoginPage });

  return (
    <div>
      <Helmet>
        <title>Вход в систему</title>
      </Helmet>
      <Header />
      <AuthForm inputsName={inputsNameLogin} />
    </div>
  );
};

export const initLoginPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
