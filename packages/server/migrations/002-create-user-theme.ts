import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface) {
  await queryInterface.createTable('user_theme', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    theme_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'site_theme',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    device: { type: DataTypes.STRING, allowNull: true },
  });

  await queryInterface.addIndex('user_theme', ['owner_id']);

  await queryInterface.addIndex('user_theme', ['theme_id']);

  await queryInterface.addConstraint('user_theme', {
    fields: ['owner_id', 'device'],
    type: 'unique',
    name: 'unique_user_device_theme',
  });
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.dropTable('user_theme');
}
