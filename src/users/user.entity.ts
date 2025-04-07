import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Trade } from '../trade/trade.entity';
import { Otp } from '../auth/entities/otp.entity';
import { Wallet } from '../wallets/entities/wallet.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'float', default: 10000 })
  balance: number;

  @Column({ default: false })
  isVerified: boolean;

  @OneToMany(() => Trade, (trade) => trade.user) trades: Trade[];

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  wallets: Wallet[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
