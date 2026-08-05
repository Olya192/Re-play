import { Button, Form, Input, message } from 'antd';
import s from './AuthForm.module.css';
import { validateEmail } from '../../utils/validate/validateEmail';
import { Rule } from 'antd/es/form';
import { validatePassword } from '../../utils/validate/validatePassword';
import { validateLogin } from '../../utils/validate/validateLogin';
import { useAuth } from '../../hooks/api/useAuth';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { validatePhone } from '../../utils/validate/validatePhone';
import { ROUTES } from '../../constants/routes';
import { authApi } from '@/api/authApi';

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
  login?: string;
  phone?: string;
  [key: string]: string | undefined;
}

export const AuthForm = ({ inputsName, pageType }: InputsName) => {
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();

  // Используем хук useAuth
  const { loading, handleSignin, handleSignup, getButtonText } = useAuth();

  // Отслеживаем все значения полей
  const values = Form.useWatch([], form);

  // Вычисляем валидность
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
  }, [values, form]);

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

  // Отправка данных - просто вызываем соответствующие функции из хука
  const handleSubmit = async (values: FormValues) => {
    const isLoginPage = pageType === 'login';
    const isRegisterPage = pageType === 'registration';

    if (isLoginPage) {
      const result = await handleSignin(values);

      if (result?.success) {
        navigate(ROUTES.HOME);
      }
    } else if (isRegisterPage) {
      const result = await handleSignup(values);

      if (result?.success) {
        navigate(ROUTES.HOME);
      }
    }
  };

  const initiateOAuth = async () => {
    try {
      const redirectUri = window.location.origin;
      const clientId = await authApi.getServiceID(redirectUri);

      const yandexAuthUrl = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}`;

      sessionStorage.setItem('oauth_in_progress', 'true');
      sessionStorage.setItem('oauth_redirect_uri', redirectUri);

      window.location.assign(yandexAuthUrl);
    } catch (error) {
      console.log(error, 'Не удалось инициировать авторизацию через Яндекс');
    }
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
          <p onClick={initiateOAuth}>войти через яндекс</p>
        </Form>
      </div>
    </main>
  );
};
