import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { LoadYearRequest, LoadYearResponse } from './contract/load-year';
import {
  ConvertCurrenciesParams,
  CurrencyService,
} from './currency-service.interface';
import { ConvertRequest, ConvertResponse } from './contract/convert';
import { CurrencyTypes } from './contract/exchangerate';

@Controller('currency')
export class CurrencyController {
  private readonly logger = new Logger(CurrencyController.name);

  constructor(private readonly currencyService: CurrencyService) {}

  @Post('convert')
  async convert(
    @Body() request: ConvertRequest,
  ): Promise<ConvertResponse | never> {
    this.logger.debug(`get loadDataForYear request`, request);
    try {
      const params: ConvertCurrenciesParams = Object.entries(request)
        .map(([currency, value]) => {
          const numValue = parseFloat(value);
          if (
            CurrencyTypes.includes(currency as typeof CurrencyTypes[number]) &&
            !isNaN(numValue)
          ) {
            return {
              value: numValue,
              name: currency as typeof CurrencyTypes[number],
            };
          }
        })
        .filter((v) => !!v);

      const convertResult = await this.currencyService.convertCurrencies(
        request.date,
        params,
      );

      const toReturn: ConvertResponse = {
        base: convertResult.base,
        date: convertResult.date.toISOString(),
      };

      params.forEach((p) => {
        switch (p.name) {
          case 'EUR':
            toReturn.EUR = String(convertResult.convertedEUR);
            break;
          case 'PLN':
            toReturn.PLN = String(convertResult.convertedPLN);
            break;
          case 'USD':
            toReturn.USD = String(convertResult.convertedUSD);
            break;
        }
      });
      return toReturn;
    } catch (e) {
      this.logger.error(e);

      throw new HttpException(e.message, HttpStatus.FORBIDDEN);
    }
  }

  @Post('load')
  async loadDataForYear(
    @Body() request: LoadYearRequest,
  ): Promise<LoadYearResponse | never> {
    this.logger.debug(`get loadDataForYear request`, request.year);

    try {
      await this.currencyService.loadForYear(
        parseInt(request.year) || undefined,
      );
      return {
        success: true,
      };
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(e.message, HttpStatus.FORBIDDEN);
    }
  }
}
