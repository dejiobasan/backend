// src/trade/trade.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Trade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.trades, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  transaction_type: string; // 'fund', 'convert', 'trade'

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ type: 'decimal', precision: 10, scale: 5, nullable: true })
  rate_used: number;

  @CreateDateColumn()
  timestamp: Date;

  @Column()
  status: string;
}
