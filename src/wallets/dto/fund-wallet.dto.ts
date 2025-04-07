import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FundWalletDto {
  @ApiProperty({
    description: 'The currency of the funds!',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'The amount to fund the wallet with',
    example: 1000,
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
