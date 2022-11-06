import { useAppDispatch, useAppSelector } from "feats/store/storeHook";
import { CountryValueFilter } from "feats/country/CountryValueFilter";
import { selectCountryValueFilter } from "feats/country/countryValueFilterSlice";

export const CountryValuesControlsContainer = () => {
  const selectedValue = useAppSelector((state) => state.countryValueFilter);
  const dispatch = useAppDispatch();
  return (
    <CountryValueFilter
      selectedValue={selectedValue.value}
      onSelect={(selectedFilter) => {
        dispatch(selectCountryValueFilter(selectedFilter));
      }}
    ></CountryValueFilter>
  );
};
