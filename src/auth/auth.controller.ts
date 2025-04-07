import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Request,
  UseGuards,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import 'dotenv/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Wallet } from 'src/wallets/entities/wallet.entity';

interface JwtPayload {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Wallet)
    private walletsRepo: Repository<Wallet>,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Get('verify')
  async verifyEmail(@Query('token') token: string) {
    if (!token) throw new BadRequestException('Token missing');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const user = await this.usersRepo.findOne({
        where: { email: decoded.email },
      });

      if (!user) throw new BadRequestException('Invalid token');
      if (user.isVerified) return { message: 'Email already verified!' };

      user.isVerified = true;
      await this.usersRepo.save(user);

      const defaultWallet = this.walletsRepo.create({
        user: { id: user.id },
        currency: 'NGN',
        balance: 0.0,
      });
      await this.walletsRepo.save(defaultWallet);

      return { message: 'Email verified successfully!' };
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Invalid or expired token');
    }
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Request() req: { user: { id: string; email: string } }) {
    return req.user;
  }
}
