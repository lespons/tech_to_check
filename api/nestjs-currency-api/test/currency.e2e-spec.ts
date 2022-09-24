import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as nock from 'nock';
import {
  CurrencyTypes,
  ExchangerateDateFormat,
  ExchangerateTimeseriesResponse,
} from '../src/currency/contract/exchangerate';
import { DateTime } from 'luxon';
import { CurrencyModel } from '../src/currency/model/currency';
import {
  ConvertRequest,
  ConvertResponse,
} from '../src/currency/contract/convert';
import {
  LoadYearRequest,
  LoadYearResponse,
} from '../src/currency/contract/load-year';
import { TEST_DB_CONFIG } from './test-db-config';

// FIXME: create test utils functions

jest.mock('../src/settings', () => ({
  ...TEST_DB_CONFIG,
}));

describe('CurrencyController (e2e)', () => {
  let app: INestApplication;
  let startEndpoint: nock.Scope;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    nock.cleanAll();
    await CurrencyModel.destroy({
      where: {},
    });
    await app.close();
  });

  describe('Loader endpoint', () => {
    it('/currency/load - should load for this year', async () => {
      const date = DateTime.utc();

      const currency = {
        EUR: 1,
        USD: 1.2,
        PLN: 5,
      };
      startEndpoint = nock('https://api.exchangerate.host')
        .get('/timeseries')
        .query({
          start_date: date.startOf('year').toFormat(ExchangerateDateFormat),
          end_date: date.minus({ day: 1 }).toFormat(ExchangerateDateFormat),
          symbols: CurrencyTypes.join(','),
        })
        .reply(200, {
          base: 'EUR',
          rates: {
            [date.toFormat(ExchangerateDateFormat)]: {
              ...currency,
            },
          },
        } as ExchangerateTimeseriesResponse);

      await request(app.getHttpServer())
        .post('/currency/load')
        .expect(201)
        .expect({
          success: true,
        } as LoadYearResponse);

      const data = await CurrencyModel.findAll({
        where: {},
        attributes: [...CurrencyTypes, 'base', 'date'],
      });

      expect(data.length).toEqual(1);
      expect(data[0].toJSON()).toEqual(
        new CurrencyModel({
          ...currency,
          base: 'EUR',
          date: date.toFormat(ExchangerateDateFormat),
        }).toJSON(),
      );
    });

    it('/currency/load - should load for previous year', async () => {
      const date = DateTime.utc().minus({ year: 1 });

      const currency = {
        EUR: 1,
        USD: 0.5,
        PLN: 2,
      };
      startEndpoint = nock('https://api.exchangerate.host')
        .get('/timeseries')
        .query({
          start_date: date.startOf('year').toFormat(ExchangerateDateFormat),
          end_date: date.endOf('year').toFormat(ExchangerateDateFormat),
          symbols: CurrencyTypes.join(','),
        })
        .reply(200, {
          base: 'EUR',
          rates: {
            [date.toFormat(ExchangerateDateFormat)]: {
              ...currency,
            },
          },
        } as ExchangerateTimeseriesResponse);

      await request(app.getHttpServer())
        .post('/currency/load')
        .send({ year: String(date.year) } as LoadYearRequest)
        .expect(201)
        .expect({
          success: true,
        } as LoadYearResponse);

      const data = await CurrencyModel.findAll({
        where: {},
        attributes: [...CurrencyTypes, 'base', 'date'],
      });

      expect(data.length).toEqual(1);
      expect(data[0].toJSON()).toEqual(
        new CurrencyModel({
          ...currency,
          base: 'EUR',
          date: date.toFormat(ExchangerateDateFormat),
        }).toJSON(),
      );
    });
  });

  describe('Convert endpoint', () => {
    const date = DateTime.utc().minus({ day: 1 });

    const currency = {
      EUR: 1,
      USD: 0.5,
      PLN: 2,
    };
    beforeEach(async () => {
      startEndpoint = nock('https://api.exchangerate.host')
        .get('/timeseries')
        .query({
          start_date: date.startOf('year').toFormat(ExchangerateDateFormat),
          end_date: date.toFormat(ExchangerateDateFormat),
          symbols: CurrencyTypes.join(','),
        })
        .reply(200, {
          base: 'EUR',
          rates: {
            [date.toFormat(ExchangerateDateFormat)]: {
              ...currency,
            },
          },
        } as ExchangerateTimeseriesResponse);
      await request(app.getHttpServer())
        .post('/currency/load')
        .send({ year: String(date.year) } as LoadYearRequest)
        .expect(201)
        .expect({
          success: true,
        } as LoadYearResponse);
    });
    it('/currency/convert - should convert for last day', async () => {
      const usdToConvert = '2.2';
      await request(app.getHttpServer())
        .post('/currency/convert')
        .send({
          USD: usdToConvert,
        } as ConvertRequest)
        .expect(201)
        .expect({
          date: date.startOf('day').toJSDate().toISOString(),
          base: 'EUR',
          USD: String(parseFloat(usdToConvert) * currency.USD),
        } as ConvertResponse);

      const data = await CurrencyModel.findAll({
        where: {},
        attributes: [...CurrencyTypes, 'base', 'date'],
      });

      expect(data.length).toEqual(1);
      expect(data[0].toJSON()).toEqual(
        new CurrencyModel({
          ...currency,
          base: 'EUR',
          date: date.toFormat(ExchangerateDateFormat),
        }).toJSON(),
      );
    });
  });

  /// TODO: add more tests and negative test to check errors
});
