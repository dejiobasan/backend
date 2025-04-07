import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
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
  status: string; // 'pending', 'completed', 'failed'
}
