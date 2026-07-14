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
} from 'sequelize-typescript';
import { SiteTheme } from './SiteTheme';
import { User } from './user';

@Table({ tableName: 'user_theme', timestamps: false })
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
  declare owner_id: number;

  @AllowNull(true)
  @Column(DataType.STRING)
  declare device: string | null;

  @BelongsTo(() => SiteTheme, { as: 'theme', foreignKey: 'theme_id' })
  declare theme?: SiteTheme;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'owner_id' })
  declare owner?: User;
}
