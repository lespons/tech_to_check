import { CountryControlsContainer } from "feats/country/CountryControlsContainer";
import styled from "styled-components";
import { CountryDataChartContainer } from "feats/country/CountryDataChartContainer";
import { CountryValuesControlsContainer } from "feats/country/CountryValuesControlsContainer";

export const CountryStatPage = () => {
  return (
    <Wrapper>
      <ControlsPanel>
        <CountryControlsContainer />
        <CountryValuesControlsContainer />
      </ControlsPanel>
      <ChartPanel>
        <CountryDataChartContainer />
      </ChartPanel>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const ControlsPanel = styled.div`
  text-align: center;
`;
const ChartPanel = styled.div``;
