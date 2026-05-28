import { Link } from 'react-router-dom';
import s from './Header.module.css';

export const Header = () => {
  return (
    <nav className={s.nav}>
      <ul className={s.list}>
        <li className={s.listItem}>
          <Link to="/" className={s.link}>
            Главная
          </Link>
        </li>
        <li className={s.listItem}>
          <Link to="/friends" className={s.link}>
            Друзья
          </Link>
        </li>
        <li className={s.listItem}>
          <Link to="/profile" className={s.link}>
            Профиль
          </Link>
        </li>
        <li className={s.listItem}>
          <Link to="/user-profile">Игровой профиль пользователя</Link>
        </li>
        <li className={s.listItem}>
          <Link to="/leaderboard" className={s.link}>
            Лидерборд
          </Link>
        </li>
        <li className={s.listItem}>
          <Link to="/forum" className={s.link}>
            Форум
          </Link>
        </li>
        <li className={`${s.listItem} ${s.listItemRight}`}>
          <Link to="/game" className={s.link}>
            Начать игру
          </Link>
        </li>
        <li className={s.listItem}>
          <Link to="/login" className={s.link}>
            Вход
          </Link>
        </li>
        <li className={s.listItem}>
          <Link to="/register" className={s.link}>
            Регистрация
          </Link>
        </li>
      </ul>
    </nav>
  );
};
