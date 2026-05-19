import { validateEmail } from '../validateEmail';

describe('validateEmail', () => {
  it('должен вернуть true для валидного email', () => {
    expect(validateEmail('simple@example.com')).toBe(true);
    expect(validateEmail('user.name@yandex.ru')).toBe(true);
    expect(validateEmail('user123@yandex.ru')).toBe(true);
    expect(validateEmail('user-123@yandex.ru')).toBe(true);
  });

  it('должен вернуть false для невалидного email', () => {
    expect(validateEmail('123')).toBe(false);
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('petrov@yandex')).toBe(false);
    expect(validateEmail('petrov@.ru')).toBe(false);
    expect(validateEmail('@some.com')).toBe(false);
  });
});
