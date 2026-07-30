import { User } from '../models/User';

export async function seedUsers() {
  const existing = await User.findOne();

  if (existing) {
    console.log('Users already seeded, skipping.');

    return;
  }

  const users = [
    { ya_id: 7154, login: 'alex_ivanov', displayName: 'Алексей Иванов' },
    { ya_id: 7155, login: 'maria_petrova', displayName: 'Мария Петрова' },
    { ya_id: 7156, login: 'dmitry_smirnov', displayName: 'Дмитрий Смирнов' },
    { ya_id: 71547, login: 'elena_kuznetsova', displayName: 'Елена Кузнецова' },
    { ya_id: 71548, login: 'sergey_popov', displayName: 'Сергей Попов' },
    { ya_id: 71549, login: 'anna_sokolova', displayName: 'Анна Соколова' },
    { ya_id: 71540, login: 'mikhail_volkov', displayName: 'Михаил Волков' },
    { ya_id: 71541, login: 'olga_morozova', displayName: 'Ольга Морозова' },
    { ya_id: 71544, login: 'andrey_novikov', displayName: 'Андрей Новиков' },
    { ya_id: 71543, login: 'tatyana_fedorova', displayName: 'Татьяна Фёдорова' },
  ];

  await User.bulkCreate(users, { ignoreDuplicates: true });
}
