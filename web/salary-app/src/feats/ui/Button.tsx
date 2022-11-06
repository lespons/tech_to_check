import styled, { css } from "styled-components";

export const PrimaryButton = styled.button<{ selected?: boolean }>`
  cursor: pointer;
  ${({ theme, selected }) => {
    if (selected) {
      return css`
        background: ${theme.red10 || "#cccc"};
      `;
    }
  }}
`;
