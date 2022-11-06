import styled from "styled-components";
import { useRef } from "react";
import { Select } from "feats/ui/Select";
import { RadioInput } from "feats/ui/RadioInput";
import React from "react";

export type CountryValueFilterType = "Annual Salary" | "Card Debt";

interface CountryValueFilterProps {
  selectedValue?: CountryValueFilterType;
  onSelect: (selectedFilter: CountryValueFilterType) => void;
}

export const CountryValueFilter = ({
  selectedValue,
  onSelect,
}: CountryValueFilterProps) => {
  const values = useRef<CountryValueFilterType[]>([
    "Annual Salary",
    "Card Debt",
  ]);
  return (
    <Wrapper>
      <Select>
        {values.current.map((v, i) => {
          return (
            <React.Fragment key={v}>
              <RadioInput
                id={v}
                name={"countryValues"}
                type={"radio"}
                onChange={() => {
                  onSelect(v);
                }}
                checked={v === selectedValue}
                value={v}
              />
              <Label htmlFor={v}>{v}</Label>
            </React.Fragment>
          );
        })}
      </Select>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  margin-top: 1rem;
`;
const Label = styled.label`
  font-weight: 600;
`;
