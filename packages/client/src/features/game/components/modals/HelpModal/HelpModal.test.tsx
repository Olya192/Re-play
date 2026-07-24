jest.mock('../../../../../api/themeApi', () => ({
  fetchThemes: jest.fn().mockResolvedValue([]),
  fetchUserTheme: jest.fn().mockResolvedValue(null),
  setUserTheme: jest.fn().mockResolvedValue({ theme: { id: 1, theme: 'light', name: 'Light' } }),
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { reducer } from '../../../../../store';
import { openModal } from '../../../../../slices/gameUi';
import { HelpModal } from './HelpModal';

const makeStore = () => configureStore({ reducer });

const renderHelp = (store: ReturnType<typeof makeStore>) =>
  render(
    <Provider store={store}>
      <HelpModal />
    </Provider>
  );

describe('HelpModal', () => {
  it('не рендерится, когда активная модалка не help', () => {
    // по умолчанию gameUi.activeModal === 'start'
    renderHelp(makeStore());

    expect(screen.queryByText('Как играть')).toBeNull();
  });

  it('показывает контент справки, когда activeModal === help', () => {
    const store = makeStore();
    store.dispatch(openModal('help'));

    renderHelp(store);

    expect(screen.getByText('Как играть')).toBeDefined();
    expect(screen.getByText('Понятно')).toBeDefined();
    expect(screen.getByText('Тапай по падающим объектам, чтобы поймать их')).toBeDefined();
  });

  it('клик по «Понятно» закрывает модалку', () => {
    const store = makeStore();
    store.dispatch(openModal('help'));

    renderHelp(store);
    fireEvent.click(screen.getByText('Понятно'));

    expect(store.getState().gameUi.activeModal).toBeNull();
    expect(screen.queryByText('Как играть')).toBeNull();
  });

  it('закрывается по Escape', () => {
    const store = makeStore();
    store.dispatch(openModal('help'));

    renderHelp(store);
    fireEvent.keyDown(window, { key: 'Escape' });

    expect(store.getState().gameUi.activeModal).toBeNull();
  });
});
