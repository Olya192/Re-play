import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  ForeignKey,
  DataType,
  BelongsTo,
  Index,
} from 'sequelize-typescript';
import { SiteTheme } from './SiteTheme';
import { User } from './User';

@Table({ tableName: 'user_theme', timestamps: false, paranoid: true })
export class UserTheme extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @ForeignKey(() => SiteTheme)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  declare theme_id: number;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column({ type: DataType.INTEGER, field: 'owner_id' })
  @Index
  declare owner_id: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare device: string;

  @BelongsTo(() => SiteTheme) declare theme: SiteTheme;
  @BelongsTo(() => User) declare owner: User;
}
