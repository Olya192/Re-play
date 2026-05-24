import { AuthForm } from '../components/AuthForm';
import { usePage } from '../hooks/usePage';
import { PageInitArgs } from '../routes';
import { fetchUserThunk, selectUser } from '../slices/userSlice';
import '../components/AuthForm/index.css';

const inputsNameLogin = [
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

const inputsNameREgistr = [
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

export const LoginPage = () => {
  usePage({ initPage: initMainPage });

  return (
    <main className="main">
      <AuthForm />
    </main>
  );
};

export const initMainPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk());
  }
};
