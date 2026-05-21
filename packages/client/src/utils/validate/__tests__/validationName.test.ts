import { validateName } from '../validateName';

describe('validateName', () => {
  it('должен вернуть true для валидного имени', () => {
    expect(validateName('Анна')).toBe(true);
    expect(validateName('Serge')).toBe(true);
    expect(validateName('Петров-Водкин')).toBe(true);
    expect(validateName('Li')).toBe(true);
  });

  it('должен вернуть false для невалидного имени', () => {
    expect(validateName('123')).toBe(false);
    expect(validateName('')).toBe(false);
    expect(validateName('Ivan Petrov')).toBe(false);
    expect(validateName('ivan')).toBe(false);
    expect(validateName('ivan123')).toBe(false);
    expect(validateName('ivan!')).toBe(false);
  });
});
