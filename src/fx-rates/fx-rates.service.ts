import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Interval } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import 'dotenv/config';

/**
 * @description Service for fetching and storing foreign exchange rates.
 * It fetches rates from an external API and stores them in a database.
 */

interface ExchangeRateApiResponse {
  conversion_rates: { [key: string]: number };
}

@Injectable()
export class FxRatesService {
  private readonly logger = new Logger(FxRatesService.name);
  private exchangeRates: { [pair: string]: number } = {};

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(ExchangeRate)
    private readonly exchangeRateRepository: Repository<ExchangeRate>,
  ) {
    this.fetchAndStoreRates();
  }

  getRate(
    baseCurrency: string,
    targetCurrency: string,
  ): Promise<number | null> {
    const pair = `${baseCurrency}-${targetCurrency}`;
    return Promise.resolve(this.exchangeRates[pair] || null);
  }

  @Interval(60000)
  async fetchAndStoreRates() {
    this.logger.log('Fetching and storing FX rates...');
    // const apiKey = process.env.EXCHANGE_RATE_API_KEY || 'key';
    const baseUrl =
      process.env.EXCHANGE_RATE_API_BASE_URL ||
      'https://api.exchangerate-api.com/v4/latest';
    const baseCurrencies = 'NGN';

    const response = await lastValueFrom(
      this.httpService.get<ExchangeRateApiResponse>(
        `${baseUrl}/${baseCurrencies}`,
      ),
    );
    const rates = response?.data?.conversion_rates || {};

    if (rates) {
      this.exchangeRates['USD-NGN'] = rates['NGN'] / rates['USD'];
      this.exchangeRates['EUR-NGN'] = rates['NGN'] / rates['EUR'];
      this.exchangeRates['GBP-NGN'] = rates['NGN'] / rates['GBP'];
      this.exchangeRates['NGN-USD'] = rates['USD'] / rates['NGN'];
      this.exchangeRates['NGN-EUR'] = rates['EUR'] / rates['NGN'];
      this.exchangeRates['NGN-GBP'] = rates['GBP'] / rates['NGN'];
      this.exchangeRates['USD-EUR'] = rates['EUR'] / rates['USD'];
      this.exchangeRates['EUR-USD'] = rates['USD'] / rates['EUR'];
      this.exchangeRates['USD-GBP'] = rates['GBP'] / rates['USD'];
      this.exchangeRates['GBP-USD'] = rates['USD'] / rates['GBP'];
      this.exchangeRates['EUR-GBP'] = rates['GBP'] / rates['EUR'];
      this.exchangeRates['GBP-EUR'] = rates['EUR'] / rates['GBP'];
      for (const base in rates) {
        if (base !== 'NGN') {
          await this.saveRate(base, 'NGN', rates['NGN'] / rates[base]);
          await this.saveRate('NGN', base, rates[base] / rates['NGN']);
        }
      }
      await this.saveRate('USD', 'EUR', rates['EUR'] / rates['USD']);
      await this.saveRate('EUR', 'USD', rates['USD'] / rates['EUR']);
      await this.saveRate('USD', 'GBP', rates['GBP'] / rates['USD']);
      await this.saveRate('GBP', 'USD', rates['USD'] / rates['GBP']);
      await this.saveRate('EUR', 'GBP', rates['GBP'] / rates['EUR']);
      await this.saveRate('GBP', 'EUR', rates['EUR'] / rates['GBP']);

      this.logger.log('FX rates fetched and stored successfully.');
    } else {
      this.logger.warn(
        'Failed to fetch FX rates: API response empty or malformed.',
      );
    }
  }
  catch(error) {
    this.logger.error('Error fetching FX rates:', error);
  }
  private async saveRate(
    base: string,
    target: string,
    rate: number,
  ): Promise<void> {
    const baseUpper = base.toUpperCase();
    const targetUpper = target.toUpperCase();
    const existingRate = await this.exchangeRateRepository.findOne({
      where: { baseCurrency: baseUpper, targetCurrency: targetUpper },
    });
    if (existingRate) {
      existingRate.rate = rate;
      await this.exchangeRateRepository.save(existingRate);
    } else {
      const newRate = this.exchangeRateRepository.create({
        baseCurrency: base,
        targetCurrency: target,
        rate,
      });
      await this.exchangeRateRepository.save(newRate);
    }
  }
}
