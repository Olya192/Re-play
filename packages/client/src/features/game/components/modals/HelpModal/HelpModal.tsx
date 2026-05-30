import { Modal } from '../../../../../components/Modal';
import { BaseButton } from '../../../../../components/BaseButton';
import { useDispatch, useSelector } from '../../../../../store';
import { selectActiveModal, closeModal } from '../../../../../slices/gameUi';
import s from './HelpModal.module.css';

export const HelpModal = () => {
  const dispatch = useDispatch();
  const activeModal = useSelector(selectActiveModal);

  const isOpen = activeModal === 'help';

  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} ariaLabel="Как играть">
      <h2 className={s.title}>Как играть</h2>
      <ul className={s.list}>
        <li>Тапай по падающим объектам, чтобы поймать их.</li>
        <li>Не давай предметам упасть — внизу ждёт монстр-гусеница.</li>
        <li>Раунд длится X минут: солнце слева направо — это таймер.</li>
        <li>Esc или клик по аватару — пауза.</li>
      </ul>
      <div className={s.gifSlot} aria-hidden>
        gif placeholder
      </div>
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
