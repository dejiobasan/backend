import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';

/**
 * @description
 * The TransactionsModule is responsible for handling all transaction-related operations.
 * It includes controllers and services for managing transactions.
 * It uses TypeORM for database operations and provides a repository for transaction entities.
 * @export
 * @class TransactionsModule
 */

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TypeOrmModule],
})
export class TransactionsModule {}
