import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object for verifying OTP authentication.
 */

export class VerifyOtpAuthDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
