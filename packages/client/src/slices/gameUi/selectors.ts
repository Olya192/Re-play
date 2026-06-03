import { RootState } from '../../store';

export const selectActiveModal = (state: RootState) => state.gameUi.activeModal;

export const selectIsAnyModalOpen = (state: RootState) => state.gameUi.activeModal !== null;
