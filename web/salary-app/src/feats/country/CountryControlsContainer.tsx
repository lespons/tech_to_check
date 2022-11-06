import { CountryFilter } from "feats/country/CountryFilter";
import { selectCountryFilter } from "./countryFilterSlice";
import { useAppDispatch, useAppSelector } from "feats/store/storeHook";

export const CountryControlsContainer = () => {
  const countryFilter = useAppSelector((state) => state.countryFilter);
  const dispatch = useAppDispatch();
  return (
    <CountryFilter
      selectedFilter={countryFilter.value?.name}
      onSelect={({ name, regexp }) => {
        dispatch(
          selectCountryFilter({
            name,
            regexp,
          })
        );
      }}
    ></CountryFilter>
  );
};
