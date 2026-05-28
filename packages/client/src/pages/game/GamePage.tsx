import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameField } from '../../components/Game/GameField';
import { FallingItem } from '../../components/Game/FallingItem';
import { Monster } from '../../components/Game/Monster';
import { Vine } from '../../components/Game/Vine';
import { Sun } from '../../components/Game/Sun';
import { GameUI } from '../../components/Game/GameUI';
import { useGameLoop } from '../../hooks/game/useGameLoop';
import { useGameEngine } from '../../hooks/game/useGameEngine';
import { startGame, pauseGame, resetGame, resumeGame } from '../../slices/gameSlice';
import { useDispatch, useSelector } from '../../store';
import type { RootState } from '../../store';
import type { FallingObject } from '../../types/game/game';

export const GamePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const gameState = useSelector((state: RootState) => state.game);
  const {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    processPointerFrame,
  } = useGameEngine();

  useGameLoop(gameState.status === 'playing', processPointerFrame);

  useEffect(() => {
    return () => {
      dispatch(resetGame());
    };
  }, [dispatch]);

  const handleStart = () => {
    dispatch(startGame());
  };

  const handlePause = () => {
    dispatch(pauseGame());
  };

  const handleResume = () => {
    dispatch(resumeGame());
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <GameField
      onPointerDownCapture={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <Sun x={gameState.sun.x} />

      {gameState.objects.map((obj: FallingObject) => (
        <FallingItem key={obj.id} id={obj.id} x={obj.x} y={obj.y} type={obj.type} />
      ))}

      <Vine height={gameState.vine.height} />

      <Monster
        x={gameState.monster.x}
        isSleeping={gameState.monster.isSleeping}
        isEating={gameState.monster.isEating}
      />

      <GameUI
        collectedFood={gameState.collectedFood}
        endReason={gameState.endReason}
        score={gameState.score}
        status={gameState.status}
        onStart={handleStart}
        onPause={handlePause}
        onResume={handleResume}
        onGoHome={handleGoHome}
      />
    </GameField>
  );
};
