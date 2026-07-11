import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/users';
import { Emojis } from '../models/emojis';

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT } = process.env;

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  username: POSTGRES_USER,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: Number(POSTGRES_PORT),
  models: [User, Emojis],
});
