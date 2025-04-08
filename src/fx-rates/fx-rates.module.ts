import { Module } from '@nestjs/common';
import { FxRatesService } from './fx-rates.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';

/** 
 @description Module for fetching and storing foreign exchange rates.
  It imports the HttpModule for making HTTP requests,
  ConfigModule for accessing environment variables,
  and TypeOrmModule for database interactions.
 */

@Module({
  imports: [HttpModule, ConfigModule, TypeOrmModule.forFeature([ExchangeRate])],
  providers: [FxRatesService],
  exports: [FxRatesService],
})
export class FxRatesModule {}
