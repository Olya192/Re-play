import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';

dotenv.config();

import { sequelize } from './db';
import { User } from './models/User';
import { SiteTheme } from './models/SiteTheme';
import { UserTheme } from './models/UserTheme';
import { themeRoutes } from './routes/themeRoutes';

sequelize.addModels([User, SiteTheme, UserTheme]);

const app = express();
app.use(cors());
app.use(express.json());

const port = Number(process.env.SERVER_PORT) || 3001;

app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('  ➜ 🎸 Database synchronized');

    themeRoutes(app);

    app.get('/friends', (_, res) => {
      res.json([
        { name: 'Саша', secondName: 'Панов' },
        { name: 'Лёша', secondName: 'Садовников' },
        { name: 'Серёжа', secondName: 'Иванов' },
      ]);
    });

    app.get('/user', (_, res) => {
      res.json({ name: '</script>Степа', secondName: 'Степанов' });
    });

    app.get('/', (_, res) => {
      res.json(' Howdy from the server :)');
    });

    app.listen(port, () => {
      console.log(`  ➜ 🎸 Server is listening on port: ${port}`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
})();
