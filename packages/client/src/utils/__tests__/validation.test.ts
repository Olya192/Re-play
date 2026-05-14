import { validateEmail } from '../validate/validateEmail';
import { validateLogin } from '../validate/validateLogin';
import { validateName } from '../validate/validateName';
import { validatePassword } from '../validate/validatePassword';
import { validatePhone } from '../validate/validatePhone';

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
