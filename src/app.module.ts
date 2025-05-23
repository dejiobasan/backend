import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WalletsModule } from './wallets/wallets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { FxRatesService } from './fx-rates/fx-rates.service';
import { FxRatesModule } from './fx-rates/fx-rates.module';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { ExchangeRate } from './fx-rates/entities/exchange-rate.entity';
import { MailService } from './mail/mail.service';

/**
 * @description
 * The AppModule is the root module of the application. It imports other modules and configures the application.
 * It uses TypeORM for database connection and configuration, and it also sets up global configuration using ConfigModule.
 * The ScheduleModule is used for scheduling tasks, and HttpModule is used for making HTTP requests.
 * The FxRatesService is injected to handle foreign exchange rates.
 * The MailService is injected to handle email sending.
 * @export
 * @class AppModule
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    WalletsModule,
    TransactionsModule,
    FxRatesModule,
    HttpModule,
    TypeOrmModule.forFeature([ExchangeRate]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, FxRatesService, MailService],
})
export class AppModule {}
