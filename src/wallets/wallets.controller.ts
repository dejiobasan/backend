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

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  async getUserWallets(@Request() req: { user: { id: string } }) {
    const userId = req.user.id;
    return this.walletsService.getUserWallets(userId);
  }

  @Post('fund')
  fundWallet(
    @Request() req: { user: { id: string } },
    @Body() fundWalletDto: FundWalletDto,
  ) {
    const userId = req.user.id;
    return this.walletsService.fundWallet(userId, fundWalletDto);
  }
}
