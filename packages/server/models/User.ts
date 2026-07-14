import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  HasMany,
  Unique,
} from 'sequelize-typescript';
import { type Optional } from 'sequelize';
import { UserTheme } from './UserTheme';

export interface UserAttributes {
  id?: number;
  login: string;
  displayName: string | null;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Unique
  @Column({ type: DataType.STRING(64) })
  declare login: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(64) })
  declare displayName: string;

  @HasMany(() => UserTheme)
  declare userThemes: UserTheme[];
}
