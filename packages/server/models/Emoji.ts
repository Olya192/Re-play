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

type EmojiAttributes = {
  id: number;
  emoji: string;
  description: string;
};

type EmojisCreationAttributes = Optional<EmojiAttributes, 'id'>;

@Table({
  tableName: 'emojis',
  timestamps: true,
  paranoid: true,
})
export class Emoji extends Model<EmojiAttributes, EmojisCreationAttributes> {
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
