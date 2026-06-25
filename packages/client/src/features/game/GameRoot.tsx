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
import { usePage } from '../../hooks';
import { PageInitArgs } from '../../routes';
import { FloatButton } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { MINUTES_IN_MS } from '../../constants';

export const GameRoot = () => {
  usePage({ initPage: initGameRoot });
  usePauseOnEsc();
  usePauseOnModal();

  // Время, проведенное на странице игры
  useEffect(() => {
    performance.mark('start-game');

    return () => {
      performance.mark('finish-game');
      const gameDetail = performance.measure('game', 'start-game', 'finish-game');
      const duration = (gameDetail.duration / MINUTES_IN_MS).toFixed(2);
      console.group('Метрики игры');
      console.log(`Длительность игры: ${duration} мин`);
      console.groupEnd();

      performance.clearMeasures('game');
      performance.clearMarks('start-game');
      performance.clearMarks('finish-game');
    };
  }, []);

  const [isFullsreen, setIsFullsreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (document.getElementById('game')) {
        setIsFullsreen(true);
        document.getElementById('game')?.requestFullscreen();
      }
    } else {
      setIsFullsreen(false);
      document.exitFullscreen?.();
    }
  };

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
          <FloatButton
            onClick={toggleFullScreen}
            icon={isFullsreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            tooltip={
              isFullsreen ? (
                <div>Выйти из полноэкранного режима</div>
              ) : (
                <div>Полноэкранный режим</div>
              )
            }
          />
        </GameStage>
      </GameLayout>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initGameRoot = async ({ dispatch, state }: PageInitArgs) => {
  // GameRoot стартует с дефолтным уровнем, ничего не инициализируем
};
