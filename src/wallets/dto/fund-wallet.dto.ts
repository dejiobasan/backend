import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @description
 * The FundWalletDto is a Data Transfer Object (DTO) used for funding wallets.
 * It includes properties for the currency and amount to fund the wallet with.
 * It uses class-validator decorators for validation and Swagger decorators for API documentation.
 * @export
 * @class FundWalletDto
 */

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
