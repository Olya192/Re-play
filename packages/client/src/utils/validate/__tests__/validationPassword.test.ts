import { validatePassword } from '../validatePassword';

describe('validatePassword', () => {
  it('должен вернуть true для валидного пароля', () => {
    expect(validatePassword('45Asdfvb')).toBe(true);
    expect(validatePassword('DFGHJdfgyr123')).toBe(true);
    expect(validatePassword('ert-ert3#Dfgh')).toBe(true);
  });

  it('должен вернуть false для невалидного пароля', () => {
    expect(validatePassword('12dD3')).toBe(false);
    expect(validatePassword('')).toBe(false);
    expect(validatePassword('asdfghdrjklfg')).toBe(false);
    expect(validatePassword('qwertyuiop[123456789asdfghjkl;zxcvbnm,.ASDQWERTYUI')).toBe(false);
    expect(validatePassword('123')).toBe(false);
  });
});
