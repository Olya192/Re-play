import { Emoji } from '../models/emoji';

export async function seedEmojis() {
  const existing = await Emoji.findOne();

  if (existing) {
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

  await Emoji.bulkCreate(emojis, { ignoreDuplicates: true });
}
