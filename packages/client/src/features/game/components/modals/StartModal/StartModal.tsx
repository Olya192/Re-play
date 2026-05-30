import { Modal } from '../../../../../components/Modal';
import { BaseButton } from '../../../../../components/BaseButton';
import { useDispatch, useSelector } from '../../../../../store';
import { selectUser } from '../../../../../slices/userSlice';
import { selectActiveModal, openModal, closeModal } from '../../../../../slices/gameUi';
import { selectLevelMeta, setPhase } from '../../../../../slices/gameSession';
import { ANON_NAME } from '../../../constants/placeholders';
import s from './StartModal.module.css';

export const StartModal = () => {
  const dispatch = useDispatch();
  const activeModal = useSelector(selectActiveModal);
  const user = useSelector(selectUser);
  const meta = useSelector(selectLevelMeta);

  const handleStart = () => {
    dispatch(setPhase('playing'));
    dispatch(closeModal());
  };

  const handleHelp = () => {
    dispatch(openModal('help'));
  };

  const isOpen = activeModal === 'start';

  return (
    <Modal isOpen={isOpen} onClose={handleStart} closeOnEsc={false} ariaLabel="Начало игры">
      <div className={s.user}>
        <div className={s.avatar}>{(user?.name ?? ANON_NAME).slice(0, 1)}</div>
        <div className={s.name}>{user ? `${user.name} ${user.secondName}` : ANON_NAME}</div>
      </div>
      <div className={s.levelLine}>
        {meta.planet} · {meta.biome} ({meta.biomeIndex}/{meta.totalBiomes})
      </div>
      <BaseButton
        title="Играем!"
        type="button"
        size="large"
        onClick={handleStart}
        style={{ width: '100%', padding: '0.9rem' }}
      />
      <BaseButton
        title="Помощь"
        type="button"
        size="default"
        onClick={handleHelp}
        style={{ width: '100%', backgroundColor: 'transparent', color: 'var(--accent-color)' }}
      />
    </Modal>
  );
};
