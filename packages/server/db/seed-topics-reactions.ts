import { Reaction } from '../models/Reaction';
import { Forum } from '../models/Forum';
import { User } from '../models/User';
import { Emoji } from '../models/Emoji';

export async function seedTopicsReactions() {
  // Проверяем, есть ли уже какие-либо реакции в таблице
  const existing = await Reaction.findOne();

  if (existing) {
    console.log('Reactions already seeded');

    return;
  }

  const topics = await Forum.findAll({
    order: [['id', 'ASC']],
    limit: 2,
  });

  if (topics.length < 2) {
    console.warn('Not enough topics (need at least 2) – skipping reactions seed');

    return;
  }

  const users = await User.findAll({
    order: [['id', 'ASC']],
    limit: 5,
  });

  const emojis = await Emoji.findAll({
    order: [['id', 'ASC']],
    limit: 5,
  });

  if (users.length < 5 || emojis.length < 5) {
    console.warn('Not enough users or emojis (need 5 each) – skipping reactions seed');

    return;
  }

  const reactionsData = [
    { user_id: users[0].id, topic_id: topics[0].id, reaction_id: emojis[0].id },
    { user_id: users[1].id, topic_id: topics[0].id, reaction_id: emojis[1].id },
    { user_id: users[2].id, topic_id: topics[0].id, reaction_id: emojis[2].id },
    { user_id: users[3].id, topic_id: topics[1].id, reaction_id: emojis[3].id },
    { user_id: users[4].id, topic_id: topics[1].id, reaction_id: emojis[4].id },
  ];

  await Reaction.bulkCreate(reactionsData, { ignoreDuplicates: true });
  console.log('Reactions seeded successfully');
}
