import { CurrencyTypesLiteral } from './exchangerate';

export type ConvertRequest = {
  [currency in CurrencyTypesLiteral]?: string;
} & { date?: string };

export type ConvertResponse = ConvertRequest & {
  base: string;
  date: string;
};
