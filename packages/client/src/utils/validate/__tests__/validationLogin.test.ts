import { validateLogin } from '../validateLogin';

describe('validateLogin', () => {
  it('должен вернуть true для валидного login', () => {
    expect(validateLogin('Petrov123')).toBe(true);
    expect(validateLogin('nikiLi')).toBe(true);
    expect(validateLogin('tor-Vald')).toBe(true);
    expect(validateLogin('Tor_vald')).toBe(true);
  });

  it('должен вернуть false для невалидного login', () => {
    expect(validateLogin('123')).toBe(false);
    expect(validateLogin('asdfghjklwertyuiopz123')).toBe(false);
    expect(validateLogin('')).toBe(false);
    expect(validateLogin('Иванов')).toBe(false);
    expect(validateLogin('niki Li')).toBe(false);
    expect(validateLogin('niki#Li')).toBe(false);
  });
});
