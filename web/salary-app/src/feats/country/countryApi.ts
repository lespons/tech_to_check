import { parse } from "papaparse";

export type DataType = Record<
  string,
  Array<{
    annualSalary: number;
    cardDebt: number;
  }>
>;

export const fetchCountries = () => {
  return fetch("/countries.csv")
    .then((csv) => {
      if (!csv?.body) {
        throw Error("Empty response");
      }
      return csv.body.getReader().read();
    })
    .then((unitArray) => {
      const str = String.fromCharCode.apply(
        null,
        unitArray.value as unknown as number[]
      );
      return parse(str);
    })
    .then((data) => {
      const [headers, ...dataNoHeaders] = data.data;
      const [countryIndex, annualSalaryIndex, debtIndex] = [
        "country",
        "annual Salary",
        "credit card debt",
      ].map((columnName) => (headers as string[]).indexOf(columnName));

      return {
        dataNoHeaders,
        countryIndex,
        annualSalaryIndex,
        debtIndex,
      };
    });
};

export function mapCsvToDataByCountry(
  dataNoHeaders: Array<any[]>,
  countryIndex: number,
  {
    annualSalaryIndex,
    debtIndex,
  }: {
    annualSalaryIndex: number;
    debtIndex: number;
  }
) {
  const dataByCountry: DataType = dataNoHeaders.reduce((result, value) => {
    if (!result[value[countryIndex]]) {
      result[value[countryIndex]] = [];
    }
    result[value[countryIndex]].push({
      annualSalary: Number(value[annualSalaryIndex]),
      cardDebt: Number(value[debtIndex]),
    });
    return result;
  }, {} as DataType);
  return dataByCountry;
}
