import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

/**
 * @description
 * The TransactionsService is responsible for handling all transaction-related operations.
 * It includes methods for retrieving user transactions.
 * It uses TypeORM for database operations and provides a repository for transaction entities.
 * @export
 * @class TransactionsService
 */

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
