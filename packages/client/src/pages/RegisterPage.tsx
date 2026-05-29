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
  },
  {
    type: 'password',
    text: 'введите пароль',
    logo: 'введите пароль',
  },
  {
    type: 'password',
    text: 'повторно введите пароль',
    logo: 'повторно введите пароль',
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
