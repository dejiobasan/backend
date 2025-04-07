import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from './entities/transaction.entity';

ApiTags('Transactions');
ApiBearerAuth();
@UseGuards(JwtAuthGuard)
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOkResponse({ description: 'Get User Transactions', type: [Transaction] })
  getUserTransactions(@Request() req: { user: { id: string } }) {
    const userId = req.user.id;
    return this.transactionsService.getUserTransactions(userId);
  }
}
