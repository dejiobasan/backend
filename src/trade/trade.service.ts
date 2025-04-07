// src/trade/trade.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Trade } from './trade.entity';
import { BuyTradeDto } from './dto/buy-trade.dto';

@Injectable()
export class TradeService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Trade) private tradeRepo: Repository<Trade>,
  ) {}

  async buyTrade(dto: BuyTradeDto): Promise<Trade> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const totalCost = dto.amount * dto.price;
    if (user.balance < totalCost) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create trade
    const trade = this.tradeRepo.create({
      user,
      type: 'BUY',
      currencyPair: dto.currencyPair,
      amount: dto.amount,
      price: dto.price,
      total: totalCost,
      status: 'completed',
      executedAt: new Date(),
    });
    await this.tradeRepo.save(trade);

    // Update user balance
    user.balance -= totalCost;
    await this.userRepo.save(user);

    return trade;
  }

  async sellTrade(dto: BuyTradeDto): Promise<Trade> {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const totalRevenue = dto.amount * dto.price;
    const trade = this.tradeRepo.create({
      user,
      type: 'SELL',
      currencyPair: dto.currencyPair,
      amount: dto.amount,
      price: dto.price,
      total: totalRevenue,
      status: 'completed',
      executedAt: new Date(),
    });
    await this.tradeRepo.save(trade);

    user.balance += totalRevenue;
    await this.userRepo.save(user);

    return trade;
  }
}
