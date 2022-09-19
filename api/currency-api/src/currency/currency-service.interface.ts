import { CurrencyModel } from './model/currency';
import { CurrencyTypesLiteral } from './contract/exchangerate';

export abstract class CurrencyService {
  public static readonly ConvertedPrefix = 'converted';

  abstract loadForYear(year: number): Promise<void | never>;

  abstract convertCurrencies<
    prefix extends typeof CurrencyService.ConvertedPrefix,
  >(
    date: string,
    currencies: ConvertCurrenciesParams,
  ): Promise<ConvertedCurrencyResult<CurrencyModel, prefix> | never>;

  abstract loadDaily(): Promise<void | never>;
}

export type ConvertCurrenciesParams = Array<{
  value: number;
  name: CurrencyTypesLiteral;
}>;
type CurrencyModelBase = Pick<CurrencyModel, 'base' | 'date'>;
type CurrencyModelCurrency = Omit<CurrencyModel, 'base' | 'date'>;

export type ConvertedCurrencyResult<
  T extends CurrencyModelCurrency,
  prefix extends typeof CurrencyService.ConvertedPrefix,
> = CurrencyModelBase & { base: string; date: Date } & {
  [Property in keyof T as `${prefix}${string & Property}`]: T[Property];
};
