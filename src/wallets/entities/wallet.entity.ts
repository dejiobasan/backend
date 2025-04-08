import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';

/** 
   @description
    The Wallet entity represents a user's wallet in the system.
    It includes properties for the wallet ID, user ID, currency type, and balance.
    The wallet is linked to a user through a many-to-one relationship.
 */

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.wallets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  currency: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0.0 })
  balance: number;
}
