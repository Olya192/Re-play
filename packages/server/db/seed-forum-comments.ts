import { ForumComments } from '../models/ForumComments';

export async function seedComments() {
  const existing = await ForumComments.findOne();

  if (existing) {
    console.log('Topics already seeded, skipping.');

    return;
  }

  const comments = [
    {
      userId: 1,
      content: 'Привет всем!',
      topicId: 3,
    },
    {
      userId: 2,
      content: 'Отличная идея!',
      topicId: 7,
    },
    {
      userId: 3,
      content: 'Нужно больше деталей',
      topicId: 3,
    },
    {
      userId: 4,
      content: 'Я согласен с предыдущим оратором',
      topicId: 5,
    },
    {
      userId: 5,
      content: 'А когда будет релиз?',
      topicId: 9,
    },
    {
      userId: 6,
      content: 'Всё супер, продолжайте в том же духе',
      topicId: 1,
    },
    {
      userId: 7,
      content: 'Есть вопросы по производительности',
      topicId: 7,
    },
    {
      userId: 8,
      content: 'Можно добавить ещё функций',
      topicId: 2,
    },
    {
      userId: 9,
      content: 'Красивый дизайн!',
      topicId: 10,
    },
    {
      userId: 10,
      content: 'Спасибо за проделанную работу',
      topicId: 4,
    },
  ];

  await ForumComments.bulkCreate(comments, { ignoreDuplicates: true });
}
