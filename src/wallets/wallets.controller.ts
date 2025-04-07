import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { ConvertCurrencyDto } from './dto/convert-currency.dto';
import { TradeCurrencyDto } from './dto/trade-currency.dto';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Wallet } from './entities/wallet.entity';

ApiTags('Wallets');
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  @ApiOkResponse({ description: 'Get user wallets', type: [Wallet] })
  async getUserWallets(@Request() req: { user: { id: string } }) {
    const userId = req.user.id;
    return this.walletsService.getUserWallets(userId);
  }

  @Post('fund')
  @ApiOkResponse({ description: 'Fund user wallet' })
  @ApiBadRequestResponse({ description: 'Invalid fund wallet request' })
  @ApiNotFoundResponse({ description: 'Wallet not found' })
  @ApiBadRequestResponse({ description: 'Invalid amount' })
  fundWallet(
    @Request() req: { user: { id: string } },
    @Body() fundWalletDto: FundWalletDto,
  ) {
    const userId = req.user.id;
    return this.walletsService.fundWallet(userId, fundWalletDto);
  }

  @Post('convert')
  @ApiOkResponse({ description: 'Currency converted successfully!' })
  @ApiBadRequestResponse({ description: 'Invalid convert currency request' })
  @ApiNotFoundResponse({ description: 'Wallet not found' })
  @ApiBadRequestResponse({ description: 'Invalid amount' })
  convertCurrency(
    @Request() req: { user: { id: string } },
    @Body() convertCurrencyDto: ConvertCurrencyDto,
  ) {
    const userId = req.user.id;
    return this.walletsService.convertCurrency(userId, convertCurrencyDto);
  }

  @Post('trade')
  @ApiOkResponse({ description: 'Currency traded successfully!', type: Object })
  @ApiBadRequestResponse({ description: 'Invalid trade currency request' })
  @ApiNotFoundResponse({ description: 'Wallets not found' })
  tradeCurrency(
    @Request() req: { user: { id: string } },
    @Body() tradeCurrencyDto: TradeCurrencyDto,
  ) {
    const userId = req.user.id;
    return this.walletsService.tradeCurrency(userId, tradeCurrencyDto);
  }
}
