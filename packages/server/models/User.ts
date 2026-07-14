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
  login: string;
  displayName: string | null;
}

type UserCreationAttributes = Optional<UserAttributes, 'id'>;

// export interface UserUpdate {
//   firstName: string;
//   lastName: string;
// }

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
  @Column({ type: DataType.STRING(64) })
  declare login: string;

  @AllowNull(true)
  @Column({ type: DataType.STRING(64) })
  declare displayName: string;
}
