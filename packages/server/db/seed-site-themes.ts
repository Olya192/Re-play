import { SiteTheme } from '../models/SiteTheme';

export async function seedSiteThemes() {
  const existing = await SiteTheme.findOne();

  if (existing) {
    console.log('Site themes already seeded');

    return;
  }

  const themes = [
    { theme: 'dark', description: 'Тёмная тема' },
    { theme: 'light', description: 'Светлая тема' },
  ];

  await SiteTheme.bulkCreate(themes, { ignoreDuplicates: true });
  console.log('Site themes seeded successfully');
}
