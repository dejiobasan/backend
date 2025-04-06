import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import 'dotenv/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async sendVerificationEmail(email: string) {
    const JWT_SECRET = process.env.JWT_SECRET || 'secret';
    const base_url = process.env.BASE_URL || 'http://localhost:3000';
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
    const verificationUrl = `${base_url}/auth/verify?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify Your Email',
      html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
    });
  }
  async register(email: string, password: string) {
    const userExists = await this.usersRepo.findOne({ where: { email } });
    if (userExists) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ email, password: hashedPassword });
    await this.usersRepo.save(user);
    await this.sendVerificationEmail(email);
    return { message: 'User registered. Please verify email.' };
  }

  async login(email: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials!');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials!');
    if (!user.isVerified)
      throw new UnauthorizedException('Email not verified!');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }
}
