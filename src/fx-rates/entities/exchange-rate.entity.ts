import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

/**
 * @description Entity representing an exchange rate between two currencies.
 * It includes the base currency, target currency, and the exchange rate value.
 * The entity is unique for each combination of base and target currencies.
 */

@Entity('exchange_rates')
@Unique(['baseCurrency', 'targetCurrency'])
export class ExchangeRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  baseCurrency: string;

  @Column()
  targetCurrency: string;

  @Column({ type: 'decimal', precision: 10, scale: 5 })
  rate: number;
}
