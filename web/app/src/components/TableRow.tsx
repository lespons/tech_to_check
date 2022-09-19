import { FC, PropsWithChildren } from "react";
import styled from "styled-components";

export type TableRowProps = {} & PropsWithChildren

export const TableRow: FC<TableRowProps> = ({ children }) => {
    return <Container role={"row"}>
        {children}
    </Container>
}

const Container = styled.div`
  display: flex;
  
  &:hover {
    background: ${({theme})=>theme.gray || 'rgba(1,1,1,0.05)'};
  }
`