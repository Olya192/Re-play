import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  Index,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'site_theme', timestamps: false, paranoid: true })
export class SiteTheme extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare id: number;

  @AllowNull(false)
  @Unique
  @Index
  @Column(DataType.STRING)
  declare theme: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare description: string;
}
