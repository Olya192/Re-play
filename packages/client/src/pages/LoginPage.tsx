import { AuthForm } from '../components/AuthForm'
import { usePage } from '../hooks/usePage'
import { PageInitArgs } from '../routes'
import { fetchUserThunk, selectUser } from '../slices/userSlice'
import '../components/AuthForm/index.css'

export const LoginPage = () => {
  usePage({ initPage: initMainPage })

  return (
    <main className="main">
      <AuthForm />
    </main>
  )
}

export const initMainPage = async ({ dispatch, state }: PageInitArgs) => {
  if (!selectUser(state)) {
    return dispatch(fetchUserThunk())
  }
}
