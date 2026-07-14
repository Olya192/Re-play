import { Sequelize } from 'sequelize-typescript';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB, POSTGRES_PORT, POSTGRES_HOST } = process.env;

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: POSTGRES_HOST || 'localhost',
  port: Number(POSTGRES_PORT) || 5432,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  logging: false,
});

export const createClientAndConnect = async (): Promise<Client | null> => {
  try {
    const client = new Client({
      user: POSTGRES_USER,
      host: 'localhost',
      database: POSTGRES_DB,
      password: POSTGRES_PASSWORD,
      port: Number(POSTGRES_PORT),
    });

    await client.connect();

    const res = await client.query('SELECT NOW()');
    console.log('  ➜ 🎸 Connected to the database at:', res?.rows?.[0].now);
    client.end();

    return client;
  } catch (e) {
    console.error(e);
  }

  return null;
};
