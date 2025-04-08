// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * @description JWT strategy for authentication
 * This strategy extracts the JWT from the request's authorization header and verifies it using the secret key.
 * If the token is valid, it extracts the user ID and email from the payload and attaches them to the request object.
 * This allows the application to identify the user making the request and authorize them accordingly.
 * @see https://docs.nestjs.com/security/authentication#jwt
 */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'defaultSecretKey',
    });
  }

  validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}
