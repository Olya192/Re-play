import { initSequelize } from './initSequelize';
import { seedEmojis } from './seed-emoji';
import { seedUsers } from './users-seed';

export async function startApp() {
  try {
    await initSequelize();
    console.log('✅ Database connected');

    await seedUsers();
    await seedEmojis();
  } catch (error) {
    console.error('Failed to start application:', error);
    throw error;
  }
}
