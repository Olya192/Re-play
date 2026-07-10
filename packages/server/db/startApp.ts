import { initSequelize } from './initSequelize';
import {
  createUser,
  getUserById,
  getUsersByFirstName,
  updateUserById,
} from '../services/user.service';

export function startApp() {
  initSequelize().then(async () => {
    /*
     *  Запуск приложения только после старта БД
     */

    // Создаем нового пользователя
    await createUser('Alex', 'Ivanov');
    // Получаем пользователей с именем Alex
    const users = await getUsersByFirstName('Alex');

    // Проверяем, найдены ли пользователи
    if (!users.length) {
      throw 'Not found';
    }

    // Получаем id первого пользователя
    const { id } = users[0];
    // Обновляем пользователя по ID
    await updateUserById(id, { firstName: 'Ivan', lastName: 'Ivanov' });

    // Ищем обновленного пользователя по id
    const findedUser = await getUserById(id);
    // Выводим в консоль найденного пользователя
    console.log('Finded user: ', findedUser);
  });
}
