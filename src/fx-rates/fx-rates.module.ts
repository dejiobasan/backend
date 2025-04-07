import { Module } from '@nestjs/common';
import { FxRatesService } from './fx-rates.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';

@Module({
  imports: [HttpModule, ConfigModule, TypeOrmModule.forFeature([ExchangeRate])],
  providers: [FxRatesService],
  exports: [FxRatesService], // Export the service so other modules can use it
})
export class FxRatesModule {}
