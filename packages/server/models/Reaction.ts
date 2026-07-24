import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import type { Optional } from 'sequelize';
import { User } from './User';
import { Forum } from './Forum';
import { Emoji } from './Emoji';

type ReactionAttributes = {
  id: number;
  user_id: number;
  topic_id: number;
  reaction_id: number;
};

type ReactionCreationAttributes = Optional<ReactionAttributes, 'id'>;

@Table({
  tableName: 'reactions',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'topic_id'],
    },
  ],
})
export class Reaction extends Model<ReactionAttributes, ReactionCreationAttributes> {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  declare id: number;

  @Index
  @ForeignKey(() => User)
  @BelongsTo(() => User, { foreignKey: 'user_id', as: 'user' })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare user_id: number;

  @Index
  @ForeignKey(() => Forum)
  @BelongsTo(() => Forum, { foreignKey: 'topic_id', as: 'forum' })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare topic_id: number;

  @Index
  @ForeignKey(() => Emoji)
  @BelongsTo(() => Emoji, { foreignKey: 'reaction_id', as: 'emoji' })
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare reaction_id: number;
}
