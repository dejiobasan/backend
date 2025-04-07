import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { Transaction } from 'src/transactions/entities/transaction.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getUserWallets(userId: string): Promise<Wallet[]> {
    return this.walletRepository.find({ where: { user: { id: userId } } });
  }

  async fundWallet(
    userId: string,
    fundWalletDto: FundWalletDto,
  ): Promise<Wallet> {
    const { currency, amount } = fundWalletDto;

    if (currency !== 'NGN') {
      throw new BadRequestException('Funding is only allowed in NGN for now.');
    }

    const wallet = await this.walletRepository.findOne({
      where: { user: { id: userId }, currency },
    });

    if (!wallet) {
      throw new NotFoundException(`Wallet not found for currency ${currency}`);
    }

    // Update the wallet balance
    wallet.balance += amount;
    await this.walletRepository.save(wallet);

    // Record the transaction
    const newTransaction = this.transactionRepository.create({
      user: { id: userId },
      transaction_type: 'fund',
      amount: amount,
      currency: currency,
      status: 'completed', // Assuming funding is always successful for now
    });
    await this.transactionRepository.save(newTransaction);

    return wallet;
  }
}
