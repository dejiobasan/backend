import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @description
 * The ConvertCurrencyDto is a Data Transfer Object (DTO) used for converting currencies.
 * It includes properties for the currency to convert from, the currency to convert to, and the amount to convert.
 * It uses class-validator decorators for validation and Swagger decorators for API documentation.
 * @export
 * @class ConvertCurrencyDto
 */

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
