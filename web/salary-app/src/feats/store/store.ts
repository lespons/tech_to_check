import { configureStore } from "@reduxjs/toolkit";
import { countryFilterSlice } from "feats/country/countryFilterSlice";
import { countryValueFilterSlice } from "feats/country/countryValueFilterSlice";

const store = configureStore({
  reducer: {
    [countryFilterSlice.name]: countryFilterSlice.reducer,
    [countryValueFilterSlice.name]: countryValueFilterSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
