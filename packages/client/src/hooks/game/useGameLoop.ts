import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { gameTick } from '../../slices/gameSlice';

export const useGameLoop = (isPlaying: boolean, onFrame?: (timestamp: number) => void) => {
  const dispatch = useDispatch();
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      return;
    }

    const loop = (timestamp: number) => {
      onFrame?.(timestamp);

      if (timestamp - lastTimeRef.current >= 16.67) {
        dispatch(gameTick(timestamp));
        lastTimeRef.current = timestamp;
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, dispatch, onFrame]);
};
