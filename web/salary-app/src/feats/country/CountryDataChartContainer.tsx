import { useEffect, useRef, useState } from "react";
import PlotlyJS from "plotly.js-dist-min";
import { CountryFilterType } from "feats/country/CountryFilter";
import { ScatterChart } from "feats/chart/ScatterChart";

import { useAppSelector } from "feats/store/storeHook";
import {
  DataType,
  fetchCountries,
  mapCsvToDataByCountry,
} from "feats/country/countryApi";
import { CountryValueFilterType } from "feats/country/CountryValueFilter";

function filterAndMapToTraces(
  data: DataType,
  {
    countryFilter,
    countryValueFilter,
  }: {
    countryFilter?: CountryFilterType;
    countryValueFilter: CountryValueFilterType;
  }
) {
  const dataKeys = Object.keys(data);

  dataKeys.sort((c1, c2) => c1.localeCompare(c2));

  const countryFilterRegexp = countryFilter
    ? new RegExp(countryFilter.regexp, "i")
    : null;

  const filteredKeys = countryFilterRegexp
    ? dataKeys.filter((country) => countryFilterRegexp.test(country))
    : dataKeys;

  const traces = filteredKeys.map((country) => {
    const y = data[country].map(({ annualSalary, cardDebt }) => {
      switch (countryValueFilter) {
        case "Annual Salary":
          return annualSalary;
        case "Card Debt":
          return cardDebt;
      }
    });

    return {
      name: country,
      hovertemplate: `${countryValueFilter} %{y:.0f}`,
      x: new Array(y.length).fill(country),
      y,
      type: "scatter",
      mode: "markers",
      marker: {
        color: countryValueFilter === "Annual Salary" ? "blue" : "orange",
      },
    } as PlotlyJS.ScatterData;
  });
  return traces;
}

export const CountryDataChartContainer = () => {
  const countriesData = useRef<DataType | null>(null);
  const countryFilter = useAppSelector((state) => state.countryFilter);
  const countryValueFilter = useAppSelector(
    (state) => state.countryValueFilter
  );

  const [chartData, setChartData] = useState<PlotlyJS.ScatterData[]>([]);

  useEffect(() => {
    fetchCountries().then(
      ({ dataNoHeaders, countryIndex, debtIndex, annualSalaryIndex }) => {
        countriesData.current = mapCsvToDataByCountry(
          dataNoHeaders as unknown as Array<any[]>,
          countryIndex,
          {
            annualSalaryIndex,
            debtIndex,
          }
        );
        setChartData(
          filterAndMapToTraces(countriesData.current, {
            countryFilter: countryFilter.value,
            countryValueFilter: countryValueFilter.value,
          })
        );
      }
    );
  }, []);

  useEffect(() => {
    if (!countriesData.current) {
      return;
    }
    setChartData(
      filterAndMapToTraces(countriesData.current, {
        countryFilter: countryFilter.value,
        countryValueFilter: countryValueFilter.value,
      })
    );
  }, [countryFilter, countryValueFilter]);

  return <ScatterChart chartData={chartData} />;
};
