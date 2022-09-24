import { Module } from '@nestjs/common';
import { ExchangerateCurrencyService } from './exchangerate-currency.service';
import { CurrencyController } from './currency.controller';
import { HttpModule } from '@nestjs/axios';
import { CurrencyService } from './currency-service.interface';
import { SequelizeModule } from '@nestjs/sequelize';
import { CurrencyModel } from './model/currency';
import { CurrencyTypes } from './contract/exchangerate';

@Module({
  imports: [HttpModule, SequelizeModule.forFeature([CurrencyModel])],
  providers: [
    {
      provide: CurrencyService,
      useClass: ExchangerateCurrencyService,
    },
    {
      provide: 'CURRENCY_TYPES',
      useValue: CurrencyTypes,
    },
  ],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
