import { useDispatch, useSelector } from '../../../../../store';
import { selectUser } from '../../../../../slices/userSlice';
import { selectLevelMeta } from '../../../../../slices/gameSession';
import { openModal } from '../../../../../slices/gameUi';
import { ANON_NAME } from '../../../constants/placeholders';
import s from './GameHeader.module.css';

export const GameHeader = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const meta = useSelector(selectLevelMeta);

  const handleAvatarClick = () => {
    dispatch(openModal('pause'));
  };

  const displayName = user ? user.displayName : ANON_NAME;

  return (
    <header className={s.header}>
      <button type="button" className={s.avatarBtn} onClick={handleAvatarClick} aria-label="Пауза">
        <span className={s.avatar}>{displayName ? displayName.slice(0, 1) : '0'}</span>
      </button>
      <div className={s.levelInfo}>
        <span className={s.planet}>{meta.planet}</span>
      </div>
    </header>
  );
};
