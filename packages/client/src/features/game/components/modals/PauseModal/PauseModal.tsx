import { Link } from 'react-router-dom';
import { Modal } from '../../../../../components/Modal';
import { BaseButton } from '../../../../../components/BaseButton';
import { useDispatch, useSelector } from '../../../../../store';
import { selectUser } from '../../../../../slices/userSlice';
import { selectActiveModal, openModal, closeModal } from '../../../../../slices/gameUi';
import { resetSession } from '../../../../../slices/gameSession';
import s from './PauseModal.module.css';

export const PauseModal = () => {
  const dispatch = useDispatch();
  const activeModal = useSelector(selectActiveModal);
  const user = useSelector(selectUser);

  const isOpen = activeModal === 'pause';

  const handleResume = () => {
    dispatch(closeModal());
  };

  const handleRestart = () => {
    dispatch(resetSession());
    dispatch(openModal('start'));
  };

  const handleHelp = () => {
    dispatch(openModal('help'));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleResume} ariaLabel="Пауза">
      <h2 className={s.title}>Пауза</h2>
      <BaseButton
        title="Продолжить"
        type="button"
        size="large"
        onClick={handleResume}
        style={{ width: '100%', padding: '0.8rem' }}
      />
      <BaseButton
        title="Начать заново"
        type="button"
        size="default"
        onClick={handleRestart}
        style={{ width: '100%' }}
      />
      <BaseButton
        title="Помощь"
        type="button"
        size="default"
        onClick={handleHelp}
        style={{ width: '100%' }}
      />
      <div className={s.links}>
        <Link to="/leaderboard" className={s.link}>
          Лидерборд
        </Link>
        {user ? (
          <Link to="/profile" className={s.link}>
            Профиль
          </Link>
        ) : (
          <Link to="/login" className={s.link}>
            Войти
          </Link>
        )}
      </div>
    </Modal>
  );
};
