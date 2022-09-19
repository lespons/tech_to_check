import { Test, TestingModule } from '@nestjs/testing';
import { SequelizeModule } from '@nestjs/sequelize';
import { DB_CONFIG } from '../settings';
import { CurrencyService } from './currency-service.interface';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CurrencyModel } from './model/currency';
import { ExchangerateCurrencyService } from './exchangerate-currency.service';
import {
  CurrencyTypes,
  ExchangerateTimeseriesResponse,
} from './contract/exchangerate';
import { Observable } from 'rxjs';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SequelizeModule.forRoot({
          ...DB_CONFIG,
          database: 'test_db',
          port: 3307,
          logQueryParameters: false,
        }),
        HttpModule,
        SequelizeModule.forFeature([CurrencyModel]),
      ],
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
    }).compile();
    service = module.get<CurrencyService>(CurrencyService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should load', async () => {
    const date = '2022-09-11';
    jest.spyOn(CurrencyModel, 'bulkCreate').mockImplementationOnce((_) => {
      /*never*/
      return Promise.resolve([]);
    });
    jest.spyOn(httpService, 'get').mockImplementationOnce((_, __) => {
      return new Observable((observer) => {
        observer.next({
          data: {
            base: 'EUR',
            rates: {
              [date]: {
                EUR: 1,
                USD: 1.2,
                PLN: 3,
              },
            },
          } as ExchangerateTimeseriesResponse,
        } as any);
        observer.complete();
      });
    });

    await service.loadForYear(2022);
    expect(CurrencyModel.bulkCreate).toHaveBeenLastCalledWith(
      ...([
        [
          {
            date,
            base: 'EUR',
            EUR: 1,
            USD: 1.2,
            PLN: 3,
          },
        ],
        {
          updateOnDuplicate: [...CurrencyTypes],
        },
      ] as Parameters<typeof CurrencyModel.bulkCreate>),
    );
  });

  it('should convert', async () => {
    // todo: no
  });
});
