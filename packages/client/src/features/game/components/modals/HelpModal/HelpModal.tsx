import { Modal } from '@/components/Modal';
import { BaseButton } from '@/components/BaseButton';
import { useDispatch, useSelector } from '@/store';
import { selectActiveModal, openModal } from '@/slices/gameUi';
import { selectPhase } from '@/slices/gameSession';
import s from './HelpModal.module.css';

export const HelpModal = () => {
  const dispatch = useDispatch();
  const activeModal = useSelector(selectActiveModal);
  const phase = useSelector(selectPhase);

  const isOpen = activeModal === 'help';

  // Help открывется из Start (фаза intro) или из Pause (во время игры)
  // Закрытие должно возвращать к той модалке, а не в пустоту (иначе игра остаётся без модалки в intro
  // — «монстр по центру, предметы не летят»)
  const handleClose = () => {
    dispatch(openModal(phase === 'intro' ? 'start' : 'pause'));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabel="Как играть">
      <h2 className={s.title}>Как играть</h2>
      <ul className={s.list}>
        <li>
          Тапай по съедобным объектам, чтобы поймать их и получать очки. За пойманные несъедобные
          предметы очки снимаются
        </li>
        <li>Не давай съедобным предметам упасть — внизу ждёт монстр и очки уменьшаться!</li>
        <li>Esc или клик по аватару — пауза</li>
      </ul>
      <BaseButton
        title="Понятно"
        type="button"
        size="default"
        onClick={handleClose}
        style={{ width: '100%' }}
      />
    </Modal>
  );
};
