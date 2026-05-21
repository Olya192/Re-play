import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <nav style={{ padding: '20px', background: '#eee', marginBottom: '20px' }}>
      <ul
        style={{ display: 'flex', gap: '15px', listStyle: 'none', padding: 0 }}>
        <li>
          <Link to="/">Главная</Link>
        </li>
        <li>
          <Link to="/friends">Друзья</Link>
        </li>
        <li>
          <Link to="/profile">Профиль</Link>
        </li>
        <li>
          <Link to="/leaderboard">Лидерборд</Link>
        </li>
        <li>
          <Link to="/forum">Форум</Link>
        </li>
        <li style={{ marginLeft: 'auto' }}>
          <Link to="/game/start">Начать игру</Link>
        </li>
        <li>
          <Link to="/login">Вход</Link>
        </li>
        <li>
          <Link to="/register">Регистрация</Link>
        </li>
      </ul>
    </nav>
  )
}
