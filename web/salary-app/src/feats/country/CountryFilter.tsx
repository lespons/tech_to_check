import styled from "styled-components";
import { useRef } from "react";
import { ArrayElement } from "utils/types";
import { PrimaryButton } from "feats/ui/Button";

export const CountriesFilterValues = [
  "ALL",
  "A to F",
  "G to L",
  "M to P",
  "Q TO Z",
] as const;

export type CountriesFilterValues = ArrayElement<typeof CountriesFilterValues>;

export type CountryFilterType = {
  name: CountriesFilterValues;
  regexp: string;
};

export const CountryFilters: CountryFilterType[] = [
  {
    name: "ALL",
    regexp: ".*",
  },
  {
    name: "A to F",
    regexp: "^[a-f]{1}",
  },
  {
    name: "G to L",
    regexp: "^[g-l]{1}",
  },
  {
    name: "M to P",
    regexp: "^[m-p]{1}",
  },
  {
    name: "Q TO Z",
    regexp: "^[q-z]{1}",
  },
];

interface CountriesFilterProps {
  selectedFilter?: CountriesFilterValues;
  onSelect: (selectedFilter: CountryFilterType) => void;
}

export const CountryFilter = ({
  selectedFilter,
  onSelect,
}: CountriesFilterProps) => {
  const filters = useRef(CountryFilters);
  return (
    <Wrapper>
      <Label>Display countries from</Label>
      <div>
        {filters.current.map(({ name, regexp }) => (
          <PrimaryButton
            key={name}
            selected={selectedFilter === name}
            onClick={() => onSelect({ name, regexp })}
          >
            {name}
          </PrimaryButton>
        ))}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div``;
const Label = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;
