import { User } from '../models/User';

export async function seedUsers() {
  const existing = await User.findOne();

  if (existing) {
    console.log('Users already seeded, skipping.');

    return;
  }

  const users = [
    { ya_id: 7154, login: 'alex_ivanov', display_name: 'Алексей Иванов' },
    { ya_id: 7155, login: 'maria_petrova', display_name: 'Мария Петрова' },
    { ya_id: 7156, login: 'dmitry_smirnov', display_name: 'Дмитрий Смирнов' },
    { ya_id: 71547, login: 'elena_kuznetsova', display_name: 'Елена Кузнецова' },
    { ya_id: 71548, login: 'sergey_popov', display_name: 'Сергей Попов' },
    { ya_id: 71549, login: 'anna_sokolova', display_name: 'Анна Соколова' },
    { ya_id: 71540, login: 'mikhail_volkov', display_name: 'Михаил Волков' },
    { ya_id: 71541, login: 'olga_morozova', display_name: 'Ольга Морозова' },
    { ya_id: 71544, login: 'andrey_novikov', display_name: 'Андрей Новиков' },
    { ya_id: 71543, login: 'tatyana_fedorova', display_name: 'Татьяна Фёдорова' },
  ];

  await User.bulkCreate(users, { ignoreDuplicates: true });
}
