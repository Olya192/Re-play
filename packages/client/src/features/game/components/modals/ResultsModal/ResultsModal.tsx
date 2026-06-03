import { Modal } from '../../../../../components/Modal';
import { BaseButton } from '../../../../../components/BaseButton';
import { useDispatch, useSelector } from '../../../../../store';
import { selectActiveModal, openModal } from '../../../../../slices/gameUi';
import {
  resetSession,
  selectCaughtCount,
  selectEatenCount,
  selectElapsedMs,
  selectLevelMeta,
  selectMissedCount,
  selectScore,
} from '../../../../../slices/gameSession';
import s from './ResultsModal.module.css';

const fmtSec = (ms: number) => Math.round(ms / 1000);

export const ResultsModal = () => {
  const dispatch = useDispatch();
  const activeModal = useSelector(selectActiveModal);
  const meta = useSelector(selectLevelMeta);
  const score = useSelector(selectScore);
  const caught = useSelector(selectCaughtCount);
  const missed = useSelector(selectMissedCount);
  const eaten = useSelector(selectEatenCount);
  const elapsedMs = useSelector(selectElapsedMs);

  const isOpen = activeModal === 'results';

  const handleAgain = () => {
    dispatch(resetSession());
    dispatch(openModal('start'));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleAgain} closeOnEsc={false} ariaLabel="Результат уровня">
      <h2 className={s.title}>Уровень пройден</h2>
      <div className={s.grid}>
        <div className={s.row}>
          {/* TODO: Считать по формулам, формулы крепить к items */}
          <span className={s.label}>Очки</span>
          <span className={s.value}>{score}</span>
        </div>
        <div className={s.row}>
          <span className={s.label}>Поймано</span>
          <span className={s.value}>{caught}</span>
        </div>
        <div className={s.row}>
          <span className={s.label}>Съедено</span>
          <span className={s.value}>{eaten}</span>
        </div>
        <div className={s.row}>
          <span className={s.label}>Упущено</span>
          <span className={s.value}>{missed}</span>
        </div>
        <div className={s.row}>
          <span className={s.label}>Время</span>
          <span className={s.value}>
            {fmtSec(elapsedMs)} / {fmtSec(meta.durationMs)} c
          </span>
        </div>
      </div>
      <BaseButton
        title="Поедим ещё!"
        type="button"
        size="large"
        onClick={handleAgain}
        style={{ width: '100%', padding: '0.8rem' }}
      />
    </Modal>
  );
};
