import { initSequelize } from './initSequelize';
import { createUser, getAllUsers } from '../services/user.service';
import { seedEmojis } from './seed-emoji';

export async function startApp() {
  await initSequelize().then(async () => {
    /*
     *  Запуск приложения только после старта БД
     */

    await seedEmojis();

    const users = await getAllUsers();

    // Проверяем, найдены ли пользователи. Сейчас, если не найден - создаем
    if (!users.length) {
      await createUser('Alex', 'Ivanov');
    }
  });
}
