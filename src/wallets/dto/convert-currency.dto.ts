import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConvertCurrencyDto {
  @ApiProperty({
    description: 'The currency to convert from',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  fromCurrency: string;

  @ApiProperty({
    description: 'The currency to convert to',
    example: 'EUR',
  })
  @IsString()
  @IsNotEmpty()
  toCurrency: string;

  @ApiProperty({
    description: 'The amount to convert',
    example: 1000,
  })
  @IsNumber()
  @IsPositive()
  amount: number;
}
