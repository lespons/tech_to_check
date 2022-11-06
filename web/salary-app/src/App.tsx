import React from "react";
import styled from "styled-components";
import { CountryStatPage } from "./pages/CountryStatPage";

function App() {
  return (
    <Wrapper>
      <CountryStatPage />
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.div`
  padding: 1rem 3rem;
`;
