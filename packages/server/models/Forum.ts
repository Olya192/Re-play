import {
  AllowNull,
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { type Optional } from 'sequelize';

export interface TopicAttributes {
  id?: number;
  title: string;
  content: string;
  comments?: Array<unknown>;
}

type TopicCreationAttributes = Optional<TopicAttributes, 'id'>;

@Table({
  tableName: 'forum_topics',
  timestamps: true,
  paranoid: true,
})
export class Forum extends Model<TopicAttributes, TopicCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(255) })
  declare title: string;

  @AllowNull(false)
  @Column({ type: DataType.STRING(2048) })
  declare content: string;
}
