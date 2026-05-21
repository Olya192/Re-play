import { validatePhone } from '../validatePhone';

describe('validatePhone', () => {
  it('должен вернуть true для валидного номера телефона', () => {
    expect(validatePhone('84991234545')).toBe(true);
    expect(validatePhone('+74991231212')).toBe(true);
    expect(validatePhone('4991232323')).toBe(true);
  });

  it('должен вернуть false для невалидного номера телефона', () => {
    expect(validatePhone('123456789123456789')).toBe(false);
    expect(validatePhone('1234567')).toBe(false);
    expect(validatePhone('')).toBe(false);
    expect(validatePhone('123d')).toBe(false);
  });
});
