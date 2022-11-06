import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CountryValueFilterType } from "feats/country/CountryValueFilter";

type StateType = { value: CountryValueFilterType };
export const countryValueFilterSlice = createSlice<
  StateType,
  {
    select(
      state: StateType,
      action: PayloadAction<CountryValueFilterType>
    ): void;
  },
  "countryValueFilter"
>({
  name: "countryValueFilter",
  initialState: { value: "Annual Salary" },
  reducers: {
    select: (state, action: PayloadAction<CountryValueFilterType>) => {
      state.value = action.payload;
    },
  },
});

export const { select: selectCountryValueFilter } =
  countryValueFilterSlice.actions;
