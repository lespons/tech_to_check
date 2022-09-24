import { Optional } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

type CurrencyAttributes = {
  date: string;
  base: string;
  EUR: number;
  USD: number;
  PLN: number;
};
type CurrencyCreationAttributes = Optional<CurrencyAttributes, 'PLN'>;

@Table({
  tableName: 'currency',
})
export class CurrencyModel extends Model<
  CurrencyAttributes,
  CurrencyCreationAttributes
> {
  @Column({
    type: DataType.DATE,
    primaryKey: true,
    unique: true,
  })
  date: Date;

  @Column
  base: string;

  @Column({
    type: DataType.FLOAT,
  })
  EUR: number;

  @Column({
    type: DataType.FLOAT,
  })
  USD: number;

  @Column({
    type: DataType.FLOAT,
  })
  PLN: number;
}
