import React from "react";
import styled from "styled-components";

export const Select = ({
  children,
}: {
  children: HTMLInputElement | HTMLInputElement[] | React.ReactElement[];
}) => {
  return (
    <Wrapper>
      <>{children}</>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  > * {
    cursor: pointer;
  }
  > label {
    margin-left: 0.5rem;
  }
  > label:not(:last-child) {
    margin-right: 1rem;
  }
`;
