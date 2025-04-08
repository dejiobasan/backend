import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for user registration.
 */

export class RegisterAuthDto {
  @ApiProperty({ description: 'User email?' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'User password?' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
