import { FC, HTMLAttributes, memo, PropsWithChildren } from "react";
import styled, { css } from "styled-components";

type ContainerProps = {
    selected?: boolean;
}
export type TableCellProps = {} & PropsWithChildren & ContainerProps & HTMLAttributes<HTMLElement>

export const TableCell: FC<TableCellProps> = memo(({ children, ...props }) => {
    return <Container role={"cell"} {...props} title={typeof children === "string" ? children : undefined}>
        {children}
    </Container>
})

const Container = styled.div<ContainerProps>`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 0.25rem;

  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
;

  ${
          ({ selected }) => selected ? css`
            background: ${({ theme }) => theme.black || 'black'};
            color: white;
            font-weight: 500;
          ` : undefined
  }
`