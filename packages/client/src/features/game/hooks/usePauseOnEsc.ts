import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store';
import { openModal, selectActiveModal } from '../../../slices/gameUi';
import { selectPhase } from '../../../slices/gameSession';

export const usePauseOnEsc = () => {
  const dispatch = useDispatch();
  const activeModal = useSelector(selectActiveModal);
  const phase = useSelector(selectPhase);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') {
        return;
      }

      if (activeModal !== null) {
        return;
      }

      if (phase !== 'playing') {
        return;
      }

      dispatch(openModal('pause'));
    };

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, activeModal, phase]);
};
