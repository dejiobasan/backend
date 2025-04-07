import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class FundWalletDto {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}
