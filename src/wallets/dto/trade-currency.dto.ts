import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TradeType {
  BUY = 'BUY',
  SELL = 'SELL',
}

export class TradeCurrencyDto {
  @ApiProperty({
    description: 'The base currency to trade',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  baseCurrency: string;

  @ApiProperty({
    description: 'The quote currency to trade',
    example: 'EUR',
  })
  @IsString()
  @IsNotEmpty()
  quoteCurrency: string;

  @ApiProperty({
    description: 'The type of trade',
    enum: TradeType,
    example: TradeType.BUY,
  })
  @IsEnum(TradeType)
  type: TradeType;

  @ApiProperty({
    description: 'The amount to trade',
    example: 1000,
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
