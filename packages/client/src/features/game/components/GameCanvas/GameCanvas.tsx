import { useRef } from 'react';
import s from './GameCanvas.module.css';

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return <canvas ref={canvasRef} className={s.canvas} aria-hidden />;
};
