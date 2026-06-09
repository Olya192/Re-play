import { Helmet } from 'react-helmet-async';
import { Header } from '../components/Header';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';
import { AuthForm, InputType } from '../components/AuthForm/AuthForm';

const inputsNameRegistr: Array<InputType> = [
  {
    type: 'text',
    text: 'введите логин',
    label: 'введите логин',
    name: 'login',
  },
  {
    type: 'email',
    text: 'введите email',
    label: 'введите email',
    name: 'email',
  },
  {
    type: 'password',
    text: 'введите пароль',
    label: 'введите пароль',
    name: 'password',
  },
  {
    type: 'password',
    text: 'повторно введите пароль',
    label: 'повторно введите пароль',
    name: 'tow-password',
  },
  {
    type: 'tel',
    text: 'Телефон',
    label: 'Телефон',
    name: 'phone',
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
      <AuthForm inputsName={inputsNameRegistr} pageType="registration" />
    </div>
  );
};

export const initRegisterPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
};
