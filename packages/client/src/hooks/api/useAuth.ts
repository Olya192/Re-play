// hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { authApi } from '../../api/authApi';

interface SignupData {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}

interface SigninData {
  login: string;
  password: string;
}

interface FormValues {
  email?: string;
  password?: string;
  text?: string;
  confirmPassword?: string;
  login?: string;
  phone?: string;
  [key: string]: string | undefined;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Проверка текущего пользователя при монтировании
  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    try {
      const user = await authApi.getCurrentUser();
      setIsAuthenticated(true);
      setCurrentUser(user);

      return user;
    } catch (error) {
      setIsAuthenticated(false);
      setCurrentUser(null);

      return null;
    }
  };

  const handleSignin = useCallback(async (values: FormValues) => {
    setLoading(true);

    try {
      // Получаем логин: приоритет у text, затем login, затем email
      const login = values.text || values.login || values.email;

      if (!login) {
        throw new Error('Логин или email обязателен для заполнения');
      }

      if (!values.password) {
        throw new Error('Пароль обязателен для заполнения');
      }

      const signinData: SigninData = {
        login: login,
        password: values.password,
      };

      await authApi.signin(signinData);

      // Получаем данные пользователя после успешного входа
      await checkCurrentUser();

      message.success('Вход выполнен успешно!');

      return { success: true };
    } catch (error: any) {
      console.error('Ошибка при входе:', error);

      if (error.response?.data?.reason) {
        message.error(error.response.data.reason);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Произошла ошибка при входе');
      }

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSignup = useCallback(async (values: FormValues) => {
    setLoading(true);

    try {
      if (!values.email) {
        throw new Error('Email обязателен для заполнения');
      }

      if (!values.password) {
        throw new Error('Пароль обязателен для заполнения');
      }

      // Получаем логин: приоритет у text, затем login, затем email
      const login = values.text || values.login || values.email;

      if (!login) {
        throw new Error('Логин или email обязателен для заполнения');
      }

      const signupData: SignupData = {
        first_name: values.first_name || 'User',
        second_name: values.second_name || 'User',
        login: login,
        email: values.email,
        password: values.password,
        phone: values.phone || '89276542358',
      };

      await authApi.signup(signupData);

      message.success('Регистрация прошла успешно!');

      return { success: true };
    } catch (error: any) {
      console.error('Ошибка при регистрации:', error);

      if (error.response?.data?.reason) {
        message.error(error.response.data.reason);
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Произошла ошибка при регистрации');
      }

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setLoading(true);

    try {
      // Раскомментируйте, когда API будет готов
      // await authApi.logout();

      setIsAuthenticated(false);
      setCurrentUser(null);
      message.success('Вы успешно вышли из системы');
      navigate('/login');

      return { success: true };
    } catch (error: any) {
      message.error('Ошибка при выходе из системы');

      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const getButtonText = useCallback(() => {
    if (loading) {
      return 'Загрузка...';
    }

    return location.pathname === '/login' ? 'Войти' : 'Зарегистрироваться';
  }, [loading, location.pathname]);

  return {
    loading,
    isAuthenticated,
    currentUser,
    handleSignin,
    handleSignup,
    handleLogout,
    checkCurrentUser,
    getButtonText,
  };
};
