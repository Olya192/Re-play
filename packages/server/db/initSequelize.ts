import { sequelize } from './sequelize';

export const initSequelize = async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connected');

    await sequelize.sync(); // временно для обучения (в проде обычно migrations)
  } catch (error) {
    console.error('Sequelize error:', error);
    throw error;
  }
};
