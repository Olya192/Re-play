import { Button, Form, Input, message } from 'antd';
import s from './AuthForm.module.css';
import { validateEmail } from '../../utils/validate/validateEmail';
import { Rule } from 'antd/es/form';
import { validatePassword } from '../../utils/validate/validatePassword';
import { validateLogin } from '../../utils/validate/validateLogin';

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
  [key: string]: string | undefined;
}

export const AuthForm = ({ inputsName }: InputsName) => {
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
                  'пароль должен быть не менее 8 символов, иметь цифру, заглавную букву и знак'
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

      case 'tow-password':
        return [
          ...baseRules,
          {
            validator: async (_: any, value: string) => {
              if (!value) {
                return;
              }

              if (!validatePassword(value)) {
                throw new Error(
                  'пароль должен быть не менее 8 символов, иметь цифру, заглавную букву и знак'
                );
              }
            },
          },
        ];

      default:
        return baseRules;
    }
  };

  return (
    <main className={s.main}>
      <div className={s.auth__form}>
        <Form<FormValues>
          style={{ width: 500 }}
          onFinish={(values: FormValues) => {
            console.log('Форма отправлена:', values);
            message.success('Вход выполнен успешно!');
          }}
          onFinishFailed={(errorInfo) => {
            console.log('Ошибки валидации:', errorInfo);
            message.error('Пожалуйста, исправьте ошибки в форме');
          }}
        >
          {inputsName.map((inputName: InputType, key: number) => (
            <Form.Item
              key={key}
              name={inputName.type}
              label={inputName.logo}
              style={{ display: 'flex', flexDirection: 'column' }}
              rules={getValidationRules(inputName)}
            >
              <Input placeholder={inputName.text} type={inputName.type} />
            </Form.Item>
          ))}

          <Button type="primary" htmlType="submit">
            Войти
          </Button>
        </Form>
      </div>
    </main>
  );
};
