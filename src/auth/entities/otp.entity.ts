import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.otps, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  otp: string;

  @Column()
  expiry_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
