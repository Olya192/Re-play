import { Button, Form, Input, message } from 'antd';
import s from './AuthForm.module.css';
import { validateEmail } from '../../utils/validate/validateEmail';
import { Rule } from 'antd/es/form';
import { validatePassword } from '../../utils/validate/validatePassword';
import { validateLogin } from '../../utils/validate/validateLogin';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/api/useAuth';

export type InputsName = {
  inputsName: Array<InputType>;
};

export type InputType = {
  type: string;
  text: string;
  logo: string;
  name: string;
};

interface FormValues {
  email?: string;
  password?: string;
  text?: string;
  confirmPassword?: string;
  [key: string]: string | undefined;
}

export const AuthForm = ({ inputsName }: InputsName) => {
  const [form] = Form.useForm<FormValues>();
  const [isFormValid, setIsFormValid] = useState(false);
  const location = useLocation();

  // Используем наш хук для авторизации
  const { loading, handleSignin, handleSignup, getButtonText } = useAuth();

  // Отслеживаем изменения полей формы для валидации кнопки
  const handleFormChange = () => {
    const fields = form.getFieldsValue();
    const errors = form.getFieldsError();

    // Проверяем, что все обязательные поля заполнены и нет ошибок
    const hasErrors = errors.some((error) => error.errors.length > 0);
    const allFieldsFilled = Object.values(fields).every(
      (value) => value !== undefined && value !== null && value !== ''
    );

    setIsFormValid(allFieldsFilled && !hasErrors);
  };

  // Следим за изменениями формы
  useEffect(() => {
    handleFormChange();
  }, [form.getFieldsValue()]);

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
            validator: async (_: any, value: string) => {
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
            validator: async (_: any, value: string) => {
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

      case 'text':
        return [
          ...baseRules,
          {
            validator: async (_: any, value: string) => {
              if (!value) {
                return;
              }

              if (!validateLogin(value)) {
                throw new Error('Логин должен содержать только латинские буквы');
              }
            },
          },
        ];

      case 'confirm-password':
        return [
          ...baseRules,
          {
            validator: async (_: any, value: string) => {
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

      default:
        return baseRules;
    }
  };

  // Отправка данных в зависимости от страницы
  const handleSubmit = async (values: FormValues) => {
    const isLoginPage = location.pathname === '/login';
    const isRegisterPage = location.pathname === '/register';

    if (isLoginPage) {
      await handleSignin(values);
    } else if (isRegisterPage) {
      await handleSignup(values);
    }
  };

  return (
    <main className={s.main}>
      <div className={s.auth__form}>
        <Form<FormValues>
          form={form}
          style={{ width: 500 }}
          onFinish={handleSubmit}
          onFieldsChange={handleFormChange}
          onFinishFailed={(errorInfo) => {
            console.log('Ошибки валидации:', errorInfo);
            message.error('Пожалуйста, исправьте ошибки в форме');
          }}
        >
          {inputsName.map((inputName: InputType, key: number) => (
            <Form.Item
              key={key}
              name={inputName.name}
              label={inputName.logo}
              style={{ display: 'flex', flexDirection: 'column' }}
              rules={getValidationRules(inputName)}
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
