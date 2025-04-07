import { IsString, IsNumber } from 'class-validator';
import { FindOperator } from 'typeorm';

export class BuyTradeDto {
  @IsString()
  currencyPair: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  price: number;
  userId: string | FindOperator<string> | undefined;
}
