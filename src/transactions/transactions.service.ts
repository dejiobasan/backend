import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getUserTransactions(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { user: { id: userId } },
      order: { timestamp: 'DESC' },
    });
  }
}
