import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameUiState, ModalId } from './types';

export const initialGameUiState: GameUiState = {
  activeModal: 'start',
};

export const gameUiSlice = createSlice({
  name: 'gameUi',
  initialState: initialGameUiState,
  reducers: {
    openModal: (state, { payload }: PayloadAction<ModalId>) => {
      state.activeModal = payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const { openModal, closeModal } = gameUiSlice.actions;

export default gameUiSlice.reducer;
