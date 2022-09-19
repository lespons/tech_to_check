export class ExchangerateTimeseriesResponse {
  base: string;
  rates: {
    [date: string]: {
      [currency in CurrencyTypesLiteral]: number;
    };
  };
}

export class ExchangerateLatestResponse {
  date: string;
  base: string;
  rates: {
    [currency in CurrencyTypesLiteral]: number;
  };
}

export const CurrencyTypes = ['EUR', 'USD', 'PLN'] as const;
export type CurrencyTypesLiteral = typeof CurrencyTypes[number];

export const ExchangerateDateFormat = 'yyyy-MM-dd';
