import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';
import { AuthForm, InputType } from '../components/AuthForm/AuthForm';

const inputsNameLogin: Array<InputType> = [
  {
    type: 'text',
    text: 'введите логин',
    label: 'введите логин',
    name: 'text',
  },
  {
    type: 'password',
    text: 'введите пароль',
    label: 'введите пароль',
    name: 'password',
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
      <AuthForm inputsName={inputsNameLogin} pageType="login" />
    </div>
  );
};

export const initLoginPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
