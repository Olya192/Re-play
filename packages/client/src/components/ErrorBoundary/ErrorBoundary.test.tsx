import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

const BrokenComponent = () => {
  throw new Error('Ошибка рендера');
};

jest.mock('../../pages/Error500', () => ({
  Error500: () => (
    <div>
      <h1>500</h1>
    </div>
  ),
}));

describe('ErrorBoundary', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('Рендер компонента без ошибок', () => {
    render(
      <ErrorBoundary>
        <div>Страница работает</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Страница работает')).toBeDefined();
  });

  test('Рендер компонента с ошибкой', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('500')).toBeDefined();
  });
});
