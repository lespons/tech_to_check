import { FC, PropsWithChildren } from "react";
import styled from "styled-components";

export type TableHeadCellProps = {} & PropsWithChildren

export const TableHeadCell: FC<TableHeadCellProps> = ({ children }) => {
    return <Container role={'hcell'}>
        {children}
    </Container>
}

const Container = styled.div`
  flex: 1;
  font-weight: bold;
`