module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/ban-ts-comment': 1,
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' }, // Строка перед return
      { blankLine: 'always', prev: '*', next: 'export' }, // Строка перед export
      { blankLine: 'never', prev: 'import', next: 'import' }, // Никогда не строка между import
      { blankLine: 'always', prev: '*', next: 'if' }, // Строка перед if
      { blankLine: 'always', prev: 'if', next: '*' }, // Строка после if
    ],
    curly: ['error', 'all'],
  },
}
