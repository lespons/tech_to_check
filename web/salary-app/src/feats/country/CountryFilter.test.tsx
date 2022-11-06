import React from "react";
import {
  CountriesFilterValues,
  CountryFilter,
  CountryFilters,
} from "feats/country/CountryFilter";
import { fireEvent, render } from "@testing-library/react";

test("renders", async () => {
  const onClick = jest.fn();
  const { container, getByText } = render(
    <CountryFilter selectedFilter={"ALL"} onSelect={onClick}></CountryFilter>
  );
  const buttons = container.querySelectorAll("button");

  expect(buttons.length).toEqual(5);

  const allButton = await getByText("ALL" as CountriesFilterValues);
  const qToZButton = await getByText("Q TO Z" as CountriesFilterValues);
  const mToPButton = await getByText("M to P" as CountriesFilterValues);
  const aToFButton = await getByText("A to F" as CountriesFilterValues);
  const gToLButton = await getByText("G to L" as CountriesFilterValues);

  expect(allButton).toBeInTheDocument();
  expect(qToZButton).toBeInTheDocument();
  expect(mToPButton).toBeInTheDocument();
  expect(aToFButton).toBeInTheDocument();
  expect(gToLButton).toBeInTheDocument();
});

test("renders and react", async () => {
  const selectedColor = "#cccc";
  const onClick = jest.fn();
  const { container, getByText, rerender } = render(
    <CountryFilter selectedFilter={"ALL"} onSelect={onClick}></CountryFilter>
  );

  let allButton = await getByText("ALL" as CountriesFilterValues);

  expect(allButton).toHaveStyle({ background: selectedColor });

  const qToZ = await getByText("Q TO Z" as CountriesFilterValues);

  fireEvent.click(qToZ);

  expect(onClick).toHaveBeenCalledWith(
    CountryFilters.find(
      ({ name }) => name === ("Q TO Z" as CountriesFilterValues)
    )
  );

  rerender(
    <CountryFilter
      selectedFilter={"Q TO Z"}
      onSelect={(v) => {
        console.log("Selected", v);
      }}
    ></CountryFilter>
  );

  allButton = await getByText("ALL" as CountriesFilterValues);
  expect(allButton).not.toHaveStyle({ background: selectedColor });

  const qToZButton = await getByText("Q TO Z" as CountriesFilterValues);
  expect(qToZButton).toHaveStyle({ background: selectedColor });
});
