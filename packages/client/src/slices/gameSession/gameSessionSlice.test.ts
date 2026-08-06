import reducer, {
  hydrateSession,
  incrementCaught,
  incrementEaten,
  incrementMissed,
  initialGameSessionState,
  resetSession,
  setPhase,
  startLevel,
  syncFromEngine,
} from './gameSessionSlice';
import { GameSessionState } from './types';

describe('gameSessionSlice', () => {
  it('возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: '@@INIT' })).toEqual(initialGameSessionState);
  });

  it('setPhase меняет только фазу', () => {
    const state = reducer(initialGameSessionState, setPhase('paused'));

    expect(state.phase).toBe('paused');
  });

  it('startLevel выставляет уровень и сбрасывает прогресс в intro', () => {
    const dirty: GameSessionState = {
      ...initialGameSessionState,
      score: 50,
      caughtCount: 5,
      missedCount: 3,
      eatenCount: 2,
      phase: 'playing',
    };

    const state = reducer(dirty, startLevel('mars/desert'));

    expect(state.levelId).toBe('mars/desert');
    expect(state.score).toBe(0);
    expect(state.caughtCount).toBe(0);
    expect(state.missedCount).toBe(0);
    expect(state.eatenCount).toBe(0);
    expect(state.phase).toBe('intro');
  });

  it('syncFromEngine обновляет только переданные поля', () => {
    const state = reducer(initialGameSessionState, syncFromEngine({ elapsedMs: 1200, score: 7 }));

    expect(state.elapsedMs).toBe(1200);
    expect(state.score).toBe(7);
    expect(state.caughtCount).toBe(initialGameSessionState.caughtCount);
  });

  it('incrementCaught без аргумента добавляет 1 к счёту и очкам', () => {
    const state = reducer(initialGameSessionState, incrementCaught());

    expect(state.caughtCount).toBe(1);
    expect(state.score).toBe(1);
  });

  it('incrementCaught принимает count для массового обновления', () => {
    const state = reducer(initialGameSessionState, incrementCaught(3));

    expect(state.caughtCount).toBe(3);
    expect(state.score).toBe(3);
  });

  it('incrementEaten и incrementMissed принимают count', () => {
    let state = reducer(initialGameSessionState, incrementEaten(3));
    expect(state.eatenCount).toBe(3);

    state = reducer(state, incrementMissed(2));
    expect(state.missedCount).toBe(2);
  });

  it('resetSession возвращает прогресс к нулю', () => {
    const dirty: GameSessionState = { ...initialGameSessionState, score: 99, caughtCount: 10 };

    const state = reducer(dirty, resetSession());

    expect(state.score).toBe(0);
    expect(state.caughtCount).toBe(0);
  });

  it('hydrateSession полностью заменяет состояние', () => {
    const restored: GameSessionState = {
      ...initialGameSessionState,
      levelId: 'mars/desert',
      score: 42,
      phase: 'paused',
    };

    expect(reducer(initialGameSessionState, hydrateSession(restored))).toEqual(restored);
  });
});
