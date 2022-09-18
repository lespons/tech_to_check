import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyController } from './currency.controller';
import { LoadYearResponse } from './contract/load-year';
import { CurrencyService } from './currency-service.interface';
import { HttpModule } from '@nestjs/axios';
import { ExchangerateCurrencyService } from './exchangerate-currency.service';

describe('CurrencyController', () => {
  let controller: CurrencyController;
  let currencyService: CurrencyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [CurrencyController],
      providers: [
        {
          provide: CurrencyService,
          useValue: {
            async loadForYear(year = 2022): Promise<void> {
              /*todo*/
            },
            async convertCurrencies(...[date, currencies]): Promise<any> {
              /*never*/
            },
          } as ExchangerateCurrencyService,
        },
      ],
    }).compile();

    controller = module.get<CurrencyController>(CurrencyController);
    currencyService = module.get<CurrencyService>(CurrencyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be loaded', async () => {
    jest.spyOn(currencyService, 'loadForYear').mockImplementation(async () => {
      /* never */
    });
    expect(
      await controller.loadDataForYear({
        year: '2022',
      }),
    ).toEqual({
      success: true,
    } as LoadYearResponse);
  });

  it('should not be loaded', async () => {
    const error = { message: 'SQL database is not available' };
    jest.spyOn(currencyService, 'loadForYear').mockImplementation(async () => {
      throw error;
    });

    await expect(async () => {
      await controller.loadDataForYear({
        year: '2022',
      });
    }).rejects.toThrow(error.message);
  });
});
