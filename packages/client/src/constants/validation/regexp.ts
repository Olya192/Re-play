/**
 * Первая буква заглавная (латиница/ кириллица)
 */
export const FIRST_LETTER_CAPITAL_REGEXP = /^[A-ZА-ЯЁ]/;

/**
 * Буквы (латиница/ кириллица), дефис
 */
export const NAME_CHARS_REGEXP = /^[A-Za-zА-Яа-яЁё-]+$/;

/**
 * Неразрешенные символы для логина: НЕ латиница, цифры, нижнее подчеркивание или дефис
 */
export const FORBIDDEN_LOGIN_CHARS_REGEXP = /[^A-Za-z0-9_-]/g;

/**
 * Разрешенные символы для логина: латиница, цифры, нижнее подчеркивание и дефис
 */
export const LOGIN_CHARS_REGEXP = /^[A-Za-z0-9_-]+$/;

/**
 * Строка - только цифры один и более раз
 */
export const DIGITS_REGEXP = /^\d+$/;

/**
 * Выражение для адреса почты
 */
export const EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;

/**
 * Одна заглавная буква
 */
export const ONE_CAPITAL_LETTER_REGEXP = /[A-Z]/;

/**
 * Одна цифра
 */
export const ONE_DIGIT_REGEXP = /[0-9]/;

/**
 * Телефон может начинаться с плюса, затем только цифры
 */
export const PHONE_REGEXP = /^\+?\d+$/;
