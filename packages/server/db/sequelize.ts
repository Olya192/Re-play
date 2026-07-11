import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/users';
import { Emojis } from '../models/emojis';

// const sequelizeOptions: SequelizeOptions = {
//   host: 'localhost',
//   port: 5432,
//   username: 'user',
//   password: 'postgres',
//   database: 'lesson_db',
//   dialect: 'postgres',
// };

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'postgres',
  database: 'lesson_db',
  models: [User, Emojis],
});
