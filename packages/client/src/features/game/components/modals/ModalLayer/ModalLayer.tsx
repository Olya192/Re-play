import { StartModal } from '../StartModal';
import { PauseModal } from '../PauseModal';
import { ResultsModal } from '../ResultsModal';
import { HelpModal } from '../HelpModal';

export const ModalLayer = () => {
  return (
    <>
      <StartModal />
      <PauseModal />
      <ResultsModal />
      <HelpModal />
    </>
  );
};
