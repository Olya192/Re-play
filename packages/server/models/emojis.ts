import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import type { Optional } from 'sequelize';

type EmojisAttributes = {
  id: number;
  emoji: string;
  description: string;
};

type EmojisCreationAttributes = Optional<EmojisAttributes, 'id'>;

@Table({
  tableName: 'emojis',
  timestamps: false,
  paranoid: true,
})
export class Emojis extends Model<EmojisAttributes, EmojisCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare emoji: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare description: string;
}
