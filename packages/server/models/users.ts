import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
} from 'sequelize-typescript';

export interface IUserAttributes {
  id?: number;
  firstName: string;
  lastName?: string;
}

export interface IUserUpdate {
  firstName: string;
  lastName: string;
}

// Пример с object model
// export const userModel: ModelAttributes<Model, IUser> = {
//   firstName: {
//     type: DataType.STRING,
//     allowNull: false,
//   },
//   lastName: {
//     type: DataType.STRING,
//   },
// };

// пример с классовой моделью
@Table({
  tableName: 'Users',
  timestamps: true, // для created_at / updated_at
})
export class User extends Model<IUserAttributes, IUserAttributes> {
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
