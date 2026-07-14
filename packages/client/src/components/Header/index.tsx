import { Link } from 'react-router-dom';
import s from './Header.module.css';
import { ThemeToggleButton } from '../ThemeToggleButton/ThemeToggleButton';

export const Header = () => {
  return (
    <nav className={s.nav}>
      <ul className={s.list}>
        <li className={s.listItem}>
          <Link to="/main" className={s.link}>
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
          <Link to="/user-profile" className={s.link}>
            Игровой профиль пользователя
          </Link>
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
        <li className={`${s.listItem} ${s.themeToggleButton}`}>
          <ThemeToggleButton />
        </li>
        <li className={`${s.listItem} ${s.listItemRight}`}>
          <Link to="/" className={s.link}>
            Начать игру
          </Link>
        </li>
        <li className={s.listItem}>
          <Link to="/logout" className={s.link}>
            Выход
          </Link>
        </li>
      </ul>
    </nav>
  );
};
