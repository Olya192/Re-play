import { User } from '../models/user'; // путь к модели User
import { SiteTheme } from '../models/SiteTheme';
import { UserTheme } from '../models/UserTheme';

export async function seedUserThemes() {
  // Проверяем, есть ли уже какие-либо записи в user_theme
  const existing = await UserTheme.findOne();
  const userExisting = await UserTheme.findOne();

  if (!userExisting) {
    console.log('No users, skipping.');

    return;
  }

  if (existing) {
    console.log('User themes already seeded, skipping.');

    return;
  }

  // Берём до 10 пользователей (сортируем по id для определённости)
  const users = await User.findAll({ limit: 10, order: [['id', 'ASC']] });

  if (!users.length) {
    console.log('No users found, skipping user themes seed.');

    return;
  }

  // Находим темы dark и light (они должны быть созданы ранее)
  const darkTheme = await SiteTheme.findOne({ where: { theme: 'dark' } });
  const lightTheme = await SiteTheme.findOne({ where: { theme: 'light' } });

  if (!darkTheme || !lightTheme) {
    console.log('Site themes not found. Please run SiteTheme seeder first.');

    return;
  }

  const records = [];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];

    // Проверяем, нет ли уже темы у этого пользователя (на случай повторного запуска)
    const existing = await UserTheme.findOne({ where: { owner_id: user.id } });

    if (existing) {
      console.log(`User ${user.id} already has a theme, skipping.`);
      continue;
    }

    const theme = i % 2 === 0 ? darkTheme : lightTheme;
    records.push({
      theme_id: theme.id,
      owner_id: user.id,
      device: null,
    });
  }

  if (records.length > 0) {
    await UserTheme.bulkCreate(records, { ignoreDuplicates: true });
    console.log(`Seeded ${records.length} user theme(s).`);
  } else {
    console.log('No new user themes to add.');
  }
}
