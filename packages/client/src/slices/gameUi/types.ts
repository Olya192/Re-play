export type ModalId = 'start' | 'pause' | 'results' | 'help';

export interface GameUiState {
  activeModal: ModalId | null;
}
