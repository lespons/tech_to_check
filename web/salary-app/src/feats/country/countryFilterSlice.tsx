import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CountryFilters, CountryFilterType } from "feats/country/CountryFilter";

type StateType = {
  value: CountryFilterType;
};
export const countryFilterSlice = createSlice<
  StateType,
  {
    select(state: StateType, action: PayloadAction<CountryFilterType>): void;
  },
  "countryFilter"
>({
  name: "countryFilter",
  initialState: {
    value: CountryFilters[0],
  },
  reducers: {
    select: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { select: selectCountryFilter } = countryFilterSlice.actions;
