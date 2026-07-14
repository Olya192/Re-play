import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { UserTheme } from './UserTheme';

@Table({ tableName: 'users', timestamps: false })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @HasMany(() => UserTheme)
  declare userThemes: UserTheme[];
}
