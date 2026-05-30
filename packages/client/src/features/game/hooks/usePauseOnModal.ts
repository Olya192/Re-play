import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../../store';
import { selectActiveModal } from '../../../slices/gameUi';
import { selectPhase, setPhase } from '../../../slices/gameSession';

export const usePauseOnModal = () => {
  const dispatch = useDispatch();
  const activeModal = useSelector(selectActiveModal);
  const phase = useSelector(selectPhase);

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'paused') {
      return;
    }

    if (activeModal !== null && phase === 'playing') {
      dispatch(setPhase('paused'));

      return;
    }

    if (activeModal === null && phase === 'paused') {
      dispatch(setPhase('playing'));
    }
  }, [activeModal, phase, dispatch]);
};
