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
import { ConvertCurrencyDto } from './dto/convert-currency.dto';
import { FxRatesService } from 'src/fx-rates/fx-rates.service';
import { TradeCurrencyDto, TradeType } from './dto/trade-currency.dto';

/**
 * @description
 * The WalletsService is responsible for handling all wallet-related operations.
 * It includes methods for getting user wallets, funding wallets, converting currencies, and trading currencies.
 * It uses TypeORM for database operations and FxRatesService for fetching exchange rates.
 * @export
 * @class WalletsService
 */

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly fxRatesService: FxRatesService,
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

    wallet.balance += amount;
    await this.walletRepository.save(wallet);

    const newTransaction = this.transactionRepository.create({
      user: { id: userId },
      transaction_type: 'fund',
      amount: amount,
      currency: currency,
      status: 'completed',
    });
    await this.transactionRepository.save(newTransaction);

    return wallet;
  }

  async convertCurrency(
    userId: string,
    convertCurrencyDto: ConvertCurrencyDto,
  ): Promise<{ message: string }> {
    const { fromCurrency, toCurrency, amount } = convertCurrencyDto;

    if (fromCurrency === toCurrency) {
      throw new BadRequestException(
        'Cannot convert between the same currency.',
      );
    }

    const fromWallet = await this.walletRepository.findOne({
      where: { user: { id: userId }, currency: fromCurrency },
    });

    if (!fromWallet) {
      throw new NotFoundException(
        `Wallet not found for currency ${fromCurrency}`,
      );
    }

    if (fromWallet.balance < amount) {
      throw new BadRequestException('Insufficient balance for conversion.');
    }

    const rate = await this.fxRatesService.getRate(fromCurrency, toCurrency);
    if (!rate) {
      throw new BadRequestException(
        `Exchange rate not available for ${fromCurrency}-${toCurrency}`,
      );
    }

    const convertedAmount = amount * rate;
    fromWallet.balance -= amount;
    await this.walletRepository.save(fromWallet);

    let toWallet = await this.walletRepository.findOne({
      where: { user: { id: userId }, currency: toCurrency },
    });

    if (toWallet) {
      toWallet.balance += convertedAmount;
      await this.walletRepository.save(toWallet);
    } else {
      toWallet = this.walletRepository.create({
        user: { id: userId },
        currency: toCurrency,
        balance: convertedAmount,
      });
      await this.walletRepository.save(toWallet);
    }
    const newTransaction = this.transactionRepository.create({
      user: { id: userId },
      transaction_type: 'convert',
      amount: amount,
      currency: fromCurrency,
      rate_used: rate,
      status: 'completed',
    });
    await this.transactionRepository.save(newTransaction);

    return {
      message: `Successfully converted ${amount} ${fromCurrency} to ${convertedAmount} ${toCurrency}`,
    };
  }

  async tradeCurrency(
    userId: string,
    tradeCurrencyDto: TradeCurrencyDto,
  ): Promise<{ message: string }> {
    const { baseCurrency, quoteCurrency, type, amount } = tradeCurrencyDto;

    if (baseCurrency === quoteCurrency) {
      throw new BadRequestException('Cannot trade the same currency pair.');
    }

    const rate = await this.fxRatesService.getRate(baseCurrency, quoteCurrency);
    if (!rate) {
      throw new BadRequestException(
        `Exchange rate not available for ${baseCurrency}-${quoteCurrency}`,
      );
    }

    const baseWallet = await this.walletRepository.findOne({
      where: { user: { id: userId }, currency: baseCurrency },
    });

    const quoteWallet = await this.walletRepository.findOne({
      where: { user: { id: userId }, currency: quoteCurrency },
    });

    if (!baseWallet || !quoteWallet) {
      throw new NotFoundException(
        'One or both wallets not found for the specified currencies.',
      );
    }

    let amountToDebit: number;
    let amountToCredit: number;
    let debitCurrency: string;
    let creditCurrency: string;
    let tradeRate: number;

    if (type === TradeType.BUY) {
      amountToDebit = amount * rate;
      amountToCredit = amount;
      debitCurrency = quoteCurrency;
      creditCurrency = baseCurrency;
      tradeRate = rate;

      if (quoteWallet.balance < amountToDebit) {
        throw new BadRequestException(
          `Insufficient balance in ${quoteCurrency} wallet to buy ${amount} ${baseCurrency}.`,
        );
      }

      quoteWallet.balance -= amountToDebit;
      baseWallet.balance += amountToCredit;
    } else if (type === TradeType.SELL) {
      amountToDebit = amount;
      amountToCredit = amount * rate;
      debitCurrency = baseCurrency;
      creditCurrency = quoteCurrency;
      tradeRate = rate;

      if (baseWallet.balance < amountToDebit) {
        throw new BadRequestException(
          `Insufficient balance in ${baseCurrency} wallet to sell ${amount} ${baseCurrency}.`,
        );
      }

      baseWallet.balance -= amountToDebit;
      quoteWallet.balance += amountToCredit;
    } else {
      throw new BadRequestException('Invalid trade type.');
    }

    await this.walletRepository.save(baseWallet);
    await this.walletRepository.save(quoteWallet);

    const newTransaction = this.transactionRepository.create({
      user: { id: userId },
      transaction_type: 'trade',
      amount: amountToDebit,
      currency: debitCurrency,
      rate_used: tradeRate,
      status: 'completed',
    });
    await this.transactionRepository.save(newTransaction);

    return {
      message: `Successfully executed ${type} order of ${amount} ${baseCurrency} for ${amountToCredit} ${creditCurrency} at a rate of ${tradeRate}`,
    };
  }
}
