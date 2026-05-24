import { Helmet } from 'react-helmet'
import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'

export const LoginPage = () => {
  usePage({ initPage: initLoginPage })

  return (
    <div>
      <Helmet>
        <title>Вход в систему</title>
      </Helmet>
      <Header />
      <h1>Вход</h1>
      <p>Форма авторизации будет здесь</p>
    </div>
  )
}

export const initLoginPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
}
