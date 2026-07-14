import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';
import { Emoji } from '../models/emoji';

const { POSTGRES_HOST, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT } = process.env;

const port = !isNaN(Number(POSTGRES_PORT)) ? Number(POSTGRES_PORT) : 5432;

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: POSTGRES_HOST || 'localhost',
  username: POSTGRES_USER || 'user',
  database: POSTGRES_DB || 'postgres',
  password: POSTGRES_PASSWORD || 'postgres',
  port: port,
  models: [User, Emoji],
});
