import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpAuthDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp: string;
}
