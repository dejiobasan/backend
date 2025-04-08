import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Transaction } from './entities/transaction.entity';

/**
 * @description
 * The TransactionsController is responsible for handling all transaction-related HTTP requests.
 * It includes an endpoint for getting user transactions.
 * It uses the TransactionsService to perform the actual operations and applies JWT authentication for security.
 * @export
 * @class TransactionsController
 */

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
