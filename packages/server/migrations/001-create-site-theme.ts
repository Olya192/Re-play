import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('site_theme', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    theme: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: false },
  });
  await queryInterface.addIndex('site_theme', ['theme']);
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('site_theme');
}
