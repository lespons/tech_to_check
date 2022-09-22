import { Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DateTime } from 'luxon';
import {
  ConvertedCurrencyResult,
  CurrencyService,
} from './currency-service.interface';
import {
  CurrencyTypes,
  ExchangerateLatestResponse,
  ExchangerateTimeseriesResponse,
} from './contract/exchangerate';
import { lastValueFrom, map } from 'rxjs';
import { CurrencyModel } from './model/currency';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ExchangerateCurrencyService implements CurrencyService {
  private readonly logger = new Logger(ExchangerateCurrencyService.name);

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(CurrencyModel)
    private currencyModel: typeof CurrencyModel,
    private sequelize: Sequelize,
    @Inject('CURRENCY_TYPES')
    private currencyTypes: typeof CurrencyTypes = CurrencyTypes,
  ) {}

  async convertCurrencies(
    ...[date, currencies]: Parameters<CurrencyService['convertCurrencies']>
  ) {
    if (!currencies.length) {
      throw { message: 'Nothing to convert' };
    }

    let result;
    try {
      const requestDate = date
        ? DateTime.fromFormat(date, 'yyyy-MM-dd').toSQLDate()
        : DateTime.utc().minus({ day: 1 }).toSQLDate();

      this.logger.verbose(`get convert for ${requestDate}`);
      // I would use model selection and calc that out
      // this.currencyModel.findOne({
      //     where: {
      //
      //     }
      // })
      const selectStatement = currencies
        .filter(({ name, value }) => {
          return !isNaN(value) && CurrencyTypes.includes(name);
        })
        .map(({ value, name }) => {
          return `${name} * ${value} as ${CurrencyService.ConvertedPrefix}${name}`;
        })
        .join(',');

      result = await this.sequelize.query<
        ConvertedCurrencyResult<
          CurrencyModel,
          typeof CurrencyService.ConvertedPrefix
        >
      >(
        `SELECT base, date, ${selectStatement}
                 FROM currency
                 WHERE date = '${requestDate}'`,
        { type: QueryTypes.SELECT },
      );
    } catch (e) {
      this.logger.error(e);
      throw { message: `Could not convert currencies for this date=${date}` };
    }

    if (!result?.length) {
      throw { message: `Miss data for this date=${date}` };
    }

    return result[0];
  }

  // FIXME: should be placed in seperated api/endpoint like currency-fetcher
  async loadForYear(year = 2022) {
    this.logger.verbose('loadFromYearBeginning called', year);

    try {
      const utc = DateTime.utc();
      const currentYear = utc.year;

      const startDate = utc
        .set({ year })
        .startOf('year')
        .toFormat('yyyy-MM-dd');
      const endDate = (
        currentYear === year
          ? utc.minus({ day: 1 })
          : utc.set({ year }).endOf('year')
      ).toFormat('yyyy-MM-dd');

      const url = `https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}&symbols=${this.currencyTypes.join(
        ',',
      )}`;
      const data = await lastValueFrom(
        this.httpService
          .get<ExchangerateTimeseriesResponse>(url)
          .pipe(map((res) => res.data)),
      );
      await this.currencyModel.bulkCreate(
        Object.entries(data.rates).map(([date, rate]) => ({
          date,
          base: data.base,
          EUR: rate.EUR,
          USD: rate.USD,
          PLN: rate.PLN,
        })),
        {
          updateOnDuplicate: [...CurrencyTypes],
        },
      );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  // FIXME: should be placed in seperated api/endpoint like currency-fetcher
  @Cron('0 0 * * * *')
  async loadDaily(): Promise<void> {
    this.logger.verbose('loadDaily called');

    try {
      const url = `https://api.exchangerate.host/latest`;
      const data = await lastValueFrom(
        this.httpService
          .get<ExchangerateLatestResponse>(url)
          .pipe(map((res) => res.data)),
      );

      await this.currencyModel.bulkCreate(
        [
          {
            date: data.date,
            base: data.base,
            EUR: data.rates.EUR,
            USD: data.rates.USD,
            PLN: data.rates.PLN,
          },
        ],
        {
          updateOnDuplicate: [...CurrencyTypes],
        },
      );
    } catch (e) {
      this.logger.error(e);
      throw { message: 'Could not load daily dat`' };
    }
  }
}
