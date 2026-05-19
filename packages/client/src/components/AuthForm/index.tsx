import { Button, Form, Input } from 'antd'
import './index.css'

export const AuthForm = () => {
  const inputsName = [
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
  ]

  return (
    <div className="auth__form">
      <h1>Вход</h1>
      <Form style={{ width: 600 }}>
        {inputsName.map((inputName, key) => (
          <Form.Item
            name={inputName.type}
            label={inputName.logo}
            style={{ display: 'flex', flexDirection: 'column' }}>
            <Input
              placeholder={inputName.text}
              key={key}
              type={inputName.type}></Input>
          </Form.Item>
        ))}
        <Button>Войти</Button>
      </Form>
    </div>
  )
}
