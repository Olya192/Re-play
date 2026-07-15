import { initSequelize } from './initSequelize';
import { seedEmojis } from './seed-emoji';
import { seedUsers } from './users-seed';
import { seedSiteThemes } from './seed-site-themes';
import { seedUserThemes } from './seed-user-themes';

export async function startApp() {
  try {
    await initSequelize();
    console.log('✅ Database connected');

    await seedUsers();
    console.log('✅ Users seeder');
    await seedEmojis();
    console.log('✅ Emojis seeder');
    await seedSiteThemes();
    console.log('✅ SiteThemes seeder');
    await seedUserThemes();
    console.log('✅ UserThemes seeder');
  } catch (error) {
    console.error('Failed to start application:', error);
    throw error;
  }
}
