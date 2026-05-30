import { Helmet } from 'react-helmet-async';
import { GameLayout } from './components/GameLayout';
import { GameStage } from './components/GameStage';
import { RotatingBackground } from './components/RotatingBackground';
import { BiomeBackground } from './components/BiomeBackground';
import { GameCanvas } from './components/GameCanvas';
import { GameHeader } from './components/hud/GameHeader';
import { GameFooter } from './components/hud/GameFooter';
import { ModalLayer } from './components/modals/ModalLayer';
import { GamePlayPlaceholder } from './components/_placeholder/GamePlayPlaceholder';
import { usePauseOnEsc } from './hooks/usePauseOnEsc';
import { usePauseOnModal } from './hooks/usePauseOnModal';
import { usePage } from '../../hooks/usePage';
import { PageInitArgs } from '../../routes';

export const GameRoot = () => {
  usePage({ initPage: initGameRoot });
  usePauseOnEsc();
  usePauseOnModal();

  return (
    <>
      <Helmet>
        <title>Re-play — играем!</title>
        <meta name="description" content="Кликер-слайсер с маскотом-гусеницей" />
      </Helmet>
      <GameLayout>
        <GameStage>
          <RotatingBackground />
          <BiomeBackground />
          <GameCanvas />
          <GamePlayPlaceholder />
          <GameHeader />
          <GameFooter />
          <ModalLayer />
        </GameStage>
      </GameLayout>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initGameRoot = async ({ dispatch, state }: PageInitArgs) => {
  // GameRoot стартует с дефолтным уровнем, ничего не инициализируем
};
