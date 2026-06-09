import { Button, Form, Input, message } from 'antd';
import s from './AuthForm.module.css';
import { validateEmail } from '../../utils/validate/validateEmail';
import { Rule } from 'antd/es/form';
import { validatePassword } from '../../utils/validate/validatePassword';
import { validateLogin } from '../../utils/validate/validateLogin';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { validatePhone } from '../../utils/validate/validatePhone';
import { getErrorMessage } from '../../utils/error/errorHandler';
import { ROUTES } from '../../constants/routes';

export type InputsName = {
  inputsName: Array<InputType>;
  pageType: string;
};

export type InputType = {
  type: string;
  text: string;
  label: string;
  name: string;
};

interface FormValues {
  email?: string;
  password?: string;
  text?: string;
  confirmPassword?: string;
  [key: string]: string | undefined;
}

export const AuthForm = ({ inputsName, pageType }: InputsName) => {
  const [form] = Form.useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Отслеживаем все значения полей
  const values = Form.useWatch([], form);

  // Вычисляем валидность напрямую (без useState!)
  const isFormValid = useMemo(() => {
    if (!values) {
      return false;
    }

    // Проверяем, что все поля заполнены
    const allFieldsFilled = Object.values(values).every(
      (value) => value !== undefined && value !== null && value !== ''
    );

    // Проверяем, что нет ошибок валидации
    const hasErrors = form.getFieldsError().some((error) => error.errors.length > 0);

    return allFieldsFilled && !hasErrors;
  }, [values, form.getFieldsError()]);

  const getValidationRules = (inputName: InputType): Rule[] => {
    const baseRules: Rule[] = [
      {
        required: true,
        message: `Пожалуйста, введите ${inputName.text}`,
      },
    ];

    switch (inputName.name) {
      case 'email':
        return [
          ...baseRules,
          {
            validator: async (_rule: Rule, value: string) => {
              // ✅ вместо any
              if (!value) {
                return;
              }

              if (!validateEmail(value)) {
                throw new Error('Email должен содержать @ и быть не длиннее 255 символов');
              }
            },
          },
        ];

      case 'password':
        return [
          ...baseRules,
          {
            validator: async (_rule: Rule, value: string) => {
              // ✅ вместо any
              if (!value) {
                return;
              }

              if (!validatePassword(value)) {
                throw new Error(
                  'Пароль должен быть не менее 8 символов, иметь цифру, заглавную букву и знак'
                );
              }
            },
          },
        ];

      case 'login':
        return [
          ...baseRules,
          {
            validator: async (_rule: Rule, value: string) => {
              // ✅ вместо any
              if (!value) {
                return;
              }

              if (!validateLogin(value)) {
                throw new Error('Логин должен содержать только латинские буквы');
              }
            },
          },
        ];

      case 'tow-password':
        return [
          ...baseRules,
          {
            validator: async (_rule: Rule, value: string) => {
              if (!value) {
                return;
              }

              const password = form.getFieldValue('password');

              if (value !== password) {
                throw new Error('Пароли не совпадают');
              }
            },
          },
        ];

      case 'phone':
        return [
          ...baseRules,
          {
            validator: async (_rule: Rule, value: string) => {
              if (!value) {
                return;
              }

              if (!validatePhone(value)) {
                throw new Error('Введите номер телефона');
              }
            },
          },
        ];

      default:
        return baseRules;
    }
  };

  // Отправка данных в зависимости от страницы
  const handleSubmit = async (values: FormValues) => {
    setLoading(true);

    try {
      const isLoginPage = pageType === 'login';
      const isRegisterPage = pageType === 'registration';

      if (isLoginPage) {
        // Проверяем, что обязательные поля заполнены
        if (!values.password) {
          throw new Error('Пароль обязателен для заполнения');
        }

        // Получаем логин (из поля text или email)
        const login = values.text || values.email;

        if (!login) {
          throw new Error('Логин или email обязателен для заполнения');
        }

        // Отправляем запрос на вход
        const signinData = {
          login: login,
          password: values.password,
        };

        await authApi.signin(signinData);

        message.success('Вход выполнен успешно!');

        // Перенаправляем на главную страницу или дашборд
        navigate(ROUTES.HOME);
      } else if (isRegisterPage) {
        // Проверяем, что все обязательные поля заполнены для регистрации
        if (!values.email) {
          throw new Error('Email обязателен для заполнения');
        }

        if (!values.password) {
          throw new Error('Пароль обязателен для заполнения');
        }

        const login = values.login || values.email;

        const phone = values.phone || '89276542358';

        if (!login) {
          throw new Error('Логин или email обязателен для заполнения');
        }

        // Отправляем запрос на регистрацию
        const signupData = {
          first_name: 'User',
          second_name: 'User',
          login: login,
          email: values.email,
          password: values.password,
          phone: phone,
        };

        await authApi.signup(signupData);

        message.success('Регистрация прошла успешно!');

        // Перенаправляем на страницу входа
        navigate(ROUTES.HOME);
      }
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    }
  };

  // Определяем текст кнопки в зависимости от страницы
  const getButtonText = () => {
    if (loading) {
      return 'Загрузка...';
    }

    return location.pathname === '/login' ? 'Войти' : 'Зарегистрироваться';
  };

  return (
    <main className={s.main}>
      <div className={s.auth__form}>
        <Form<FormValues>
          form={form}
          style={{ width: 500 }}
          onFinish={handleSubmit}
          onFinishFailed={() => {
            message.error('Пожалуйста, исправьте ошибки в форме');
          }}
        >
          {inputsName.map((inputName: InputType) => (
            <Form.Item
              key={inputName.name}
              name={inputName.name}
              label={inputName.label}
              style={{ display: 'flex', flexDirection: 'column' }}
              rules={getValidationRules(inputName)}
              shouldUpdate
            >
              <Input
                placeholder={inputName.text}
                type={inputName.type === 'password' ? 'password' : 'text'}
              />
            </Form.Item>
          ))}

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!isFormValid || loading}
          >
            {getButtonText()}
          </Button>
        </Form>
      </div>
    </main>
  );
};
