import { Button, Form, Input } from 'antd';
import s from './AuthForm.module.css';

export type InputsName = {
  inputsName: Array<InputType>;
};

export type InputType = {
  type: string;
  text: string;
  logo: string;
};

export const AuthForm = ({ inputsName }: InputsName) => {
  return (
    <main className={s.main}>
      <div className={s.auth__form}>
        <h1>Вход</h1>
        <Form style={{ width: 500 }}>
          {inputsName.map((inputName, key) => (
            <Form.Item
              name={inputName.type}
              label={inputName.logo}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Input placeholder={inputName.text} key={key} type={inputName.type}></Input>
            </Form.Item>
          ))}
          <Button>Войти</Button>
        </Form>
      </div>
    </main>
  );
};
