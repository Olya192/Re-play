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


## Reactions - реакции на топики

- поиск всех реакций на топик по ID: GET ```${BASE_URL}/reactions```
- создать: POST ```${BASE_URL}/reactions```
- обновить: PUT ```${BASE_URL}/reactions```
- удалить: POST ```${BASE_URL}/reactions/delete```


#### Сидеры

- Запускаются при старте приложения здесь ```packages/server/db/startApp.ts```
- На текущий момент имеем таблицы 
```
  users
  emojis
  site_theme
  user_theme
  forum_topics
  forum_topics
  reactions
 ```
