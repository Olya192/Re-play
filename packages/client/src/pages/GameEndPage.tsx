import { Helmet } from 'react-helmet'
import { Header } from '../components/Header'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'

export const GameEndPage = () => {
  usePage({ initPage: initGameEndPage })

  return (
    <div>
      <Helmet>
        <title>Игра завершена</title>
      </Helmet>
      <Header />
      <h1>Конец</h1>
      <p>Твой счет: 0</p>
      <button style={{ padding: '10px 20px', fontSize: '18px' }}>
        🔄 Играть снова
      </button>
    </div>
  )
}

export const initGameEndPage = async ({ dispatch, state }: PageInitArgs) => {
  // заглушка
}
