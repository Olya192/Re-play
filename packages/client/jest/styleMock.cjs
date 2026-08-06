// Спасибо ИИшке чики-пики
// Стаб для CSS-модулей в тестах. Возвращает имя класса по любому ключу
// (s.title === 'title'), чтобы className не падал. Отдаёт сам себя как `default`,
// т.к. в проекте esModuleInterop: false и `import s from './x.module.css'`
// компилируется в require('x').default.
const styles = new Proxy(
  {},
  {
    get(_target, key) {
      if (key === '__esModule') {
        return false;
      }

      if (key === 'default') {
        return styles;
      }

      return typeof key === 'string' ? key : undefined;
    },
  }
);

module.exports = styles;
