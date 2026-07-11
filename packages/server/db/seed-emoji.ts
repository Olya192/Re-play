import { Emojis } from '../models/emojis';

export async function seedEmojis() {
  const count = await Emojis.count();

  if (count > 0) {
    console.log('Emojis already seeded');

    return;
  }

  const emojis = [
    { emoji: '😀', description: 'Улыбка' },
    { emoji: '😂', description: 'Смех до слёз' },
    { emoji: '🥳', description: 'Праздник' },
    { emoji: '😎', description: 'Крутой' },
    { emoji: '🤔', description: 'Задумчивость' },
    { emoji: '🚀', description: 'Ракета' },
    { emoji: '❤️', description: 'Красное сердце' },
    { emoji: '🔥', description: 'Огонь' },
  ];

  await Emojis.bulkCreate(emojis);
  console.log(`Seeded ${emojis.length} emojis`);
}
