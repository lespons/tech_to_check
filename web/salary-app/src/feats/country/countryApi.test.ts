import { DataType, mapCsvToDataByCountry } from "feats/country/countryApi";

test("mapCsvToDataByCountry - with 1 element", async () => {
  const countryToCheck = "country1";
  const dataArray = [[countryToCheck, 20000, 1000]];
  const countryIndex = 0;
  const annualSalaryIndex = 1;
  const debtIndex = 2;
  const data = mapCsvToDataByCountry(dataArray, countryIndex, {
    annualSalaryIndex,
    debtIndex,
  });

  const [firstElement] = dataArray;
  expect(data).toEqual({
    [countryToCheck]: [
      {
        annualSalary: firstElement[annualSalaryIndex],
        cardDebt: firstElement[debtIndex],
      },
    ],
  } as DataType);
});

test("mapCsvToDataByCountry - with 2 elements and diff countries", async () => {
  const dataArray = [
    ["country1", 20000, 1000],
    ["country2", 30000, 100],
  ];
  const countryIndex = 0;
  const annualSalaryIndex = 1;
  const debtIndex = 2;
  const data = mapCsvToDataByCountry(dataArray, countryIndex, {
    annualSalaryIndex,
    debtIndex,
  });

  const [firstElement, secondElement] = dataArray;
  expect(data).toEqual({
    country1: [
      {
        annualSalary: firstElement[annualSalaryIndex],
        cardDebt: firstElement[debtIndex],
      },
    ],
    country2: [
      {
        annualSalary: secondElement[annualSalaryIndex],
        cardDebt: secondElement[debtIndex],
      },
    ],
  } as DataType);
});

test("mapCsvToDataByCountry - with 2 elements and diff 1 country", async () => {
  const dataArray = [
    ["country1", 20000, 1000],
    ["country1", 30000, 100],
  ];
  const countryIndex = 0;
  const annualSalaryIndex = 1;
  const debtIndex = 2;
  const data = mapCsvToDataByCountry(dataArray, countryIndex, {
    annualSalaryIndex,
    debtIndex,
  });

  const [firstElement, secondElement] = dataArray;
  expect(data).toEqual({
    country1: [
      {
        annualSalary: firstElement[annualSalaryIndex],
        cardDebt: firstElement[debtIndex],
      },
      {
        annualSalary: secondElement[annualSalaryIndex],
        cardDebt: secondElement[debtIndex],
      },
    ],
  } as DataType);
});

// TODO test fetchCountries
