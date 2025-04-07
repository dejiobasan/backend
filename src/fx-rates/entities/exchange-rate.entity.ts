import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

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
