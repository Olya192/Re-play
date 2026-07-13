# API

## Emoji

- получить все: GET ```${BASE_URL}/emoji```

#### Пример:
```js
  const BASE_URL = 'http://localhost:3001';

  fetch(`${BASE_URL}/emoji`)
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.error(err));
```

- создать: POST ```${BASE_URL}/emoji```
- поиск: GET ```${BASE_URL}/emoji/search?description=улыбка```
             ```${BASE_URL}/emoji/search?id=5```
- еще поиск по id: GET ```${BASE_URL}/emoji/5```
- обновить: PUT ```${BASE_URL}/emoji/5```
- удалить: DELETE ```${BASE_URL}/emoji/5```
