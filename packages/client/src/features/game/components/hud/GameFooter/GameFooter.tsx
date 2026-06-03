import { Link } from 'react-router-dom';
import { useDispatch } from '../../../../../store';
import { openModal } from '../../../../../slices/gameUi';
import s from './GameFooter.module.css';

export const GameFooter = () => {
  const dispatch = useDispatch();

  const handleHelp = () => {
    dispatch(openModal('help'));
  };

  return (
    <footer className={s.footer}>
      <button type="button" className={s.btn} onClick={handleHelp}>
        Помощь
      </button>
      <Link to="/forum" className={s.btn}>
        Форум
      </Link>
      <Link to="/leaderboard" className={s.btn}>
        Лучшие!
      </Link>
    </footer>
  );
};
