import { ApiProperty } from '@nestjs/swagger';

/**
 * @description Data Transfer Object for authentication response.
 * Contains the JWT access token.
 * This token is used to authenticate the user for subsequent requests.
 * @see https://docs.nestjs.com/security/authentication#jwt
 * */

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;
}
