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
import { Forum } from './Forum';
import { User } from './User';

export interface CommentAttributes {
  id?: number;
  userId: number;
  topicId: number;
  content: string;
}

type CommentCreationAttributes = Optional<CommentAttributes, 'id'>;

@Table({
  tableName: 'forum_comments',
  timestamps: true,
  paranoid: true,
})
export class ForumComments extends Model<CommentAttributes, CommentCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare userId: number;

  @ForeignKey(() => Forum)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER })
  declare topicId: number;

  @AllowNull(false)
  @Column({ type: DataType.STRING(2048) })
  declare content: string;

  @BelongsTo(() => Forum, { as: 'topic', foreignKey: 'topicId' })
  declare topic?: Forum;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  declare user?: User;
}
