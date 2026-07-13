import { User } from '../models/user';

export async function seedUsers() {
  const existing = await User.findOne();

  if (existing) {
    console.log('Users already seeded, skipping.');

    return;
  }

  const users = [
    { login: 'alex_ivanov', displayName: 'Алексей Иванов' },
    { login: 'maria_petrova', displayName: 'Мария Петрова' },
    { login: 'dmitry_smirnov', displayName: 'Дмитрий Смирнов' },
    { login: 'elena_kuznetsova', displayName: 'Елена Кузнецова' },
    { login: 'sergey_popov', displayName: 'Сергей Попов' },
    { login: 'anna_sokolova', displayName: 'Анна Соколова' },
    { login: 'mikhail_volkov', displayName: 'Михаил Волков' },
    { login: 'olga_morozova', displayName: 'Ольга Морозова' },
    { login: 'andrey_novikov', displayName: 'Андрей Новиков' },
    { login: 'tatyana_fedorova', displayName: 'Татьяна Фёдорова' },
  ];

  await User.bulkCreate(users, { ignoreDuplicates: true });
}
