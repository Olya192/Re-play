import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';
import { AuthForm, InputType } from '../components/AuthForm/AuthForm';

const inputsNameRegistr: Array<InputType> = [
  {
    type: 'text',
    text: 'введите логин',
    logo: 'введите логин',
    name: 'text',
  },
  {
    type: 'email',
    text: 'введите email',
    logo: 'введите email',
    name: 'email',
  },
  {
    type: 'password',
    text: 'введите пароль',
    logo: 'введите пароль',
    name: 'password',
  },
  {
    type: 'password',
    text: 'повторно введите пароль',
    logo: 'повторно введите пароль',
    name: 'tow-password',
  },
];

export const RegisterPage = () => {
  usePage({ initPage: initRegisterPage });

  return (
    <div>
      <Helmet>
        <title>Регистрация</title>
      </Helmet>
      <Header />
      <h1>Регистрация</h1>
      <AuthForm inputsName={inputsNameRegistr} />
    </div>
  );
};

export const initRegisterPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
