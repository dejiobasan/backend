import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletsController } from './wallets.controller';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { FxRatesModule } from 'src/fx-rates/fx-rates.module';

/**
 * @description
 * The WalletsModule is responsible for handling all wallet-related operations.
 * It includes controllers and services for managing wallets, funding wallets, converting currencies, and trading currencies.
 * It uses TypeORM for database operations and FxRatesService for fetching exchange rates.
 * @export
 * @class WalletsModule
 */

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet]),
    TransactionsModule,
    FxRatesModule,
  ],
  providers: [WalletsService],
  controllers: [WalletsController],
  exports: [TypeOrmModule],
})
export class WalletsModule {}
