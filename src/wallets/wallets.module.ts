import { Module } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletsController } from './wallets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet])],
  providers: [WalletsService],
  controllers: [WalletsController],
})
export class WalletsModule {}
