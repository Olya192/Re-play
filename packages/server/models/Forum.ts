import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { type Optional } from 'sequelize';
import { User } from './User';

export interface TopicAttributes {
  id?: number;
  title: string;
  content: string;
  userId?: number;
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

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare userId: number;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  declare user?: User;
}
