import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
} from 'sequelize-typescript';
import type { Optional } from 'sequelize';

export interface UserAttributes {
  id?: number;
  firstName: string;
  lastName?: string;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

export interface UserUpdate {
  firstName: string;
  lastName: string;
}

// пример с классовой моделью
@Table({
  tableName: 'users',
  timestamps: true, // для created_at / updated_at
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  override id!: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  firstName!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  lastName!: string;
}
