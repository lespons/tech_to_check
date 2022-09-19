import { FC, PropsWithChildren } from "react";
import styled from "styled-components";

export type TableHeadRowProps = {} & PropsWithChildren

export const TableHeadRow: FC<TableHeadRowProps> = ({ children }) => {
    return <Container role={'hrow'}>
        {children}
    </Container>
}

const Container = styled.div`
  display: flex;
`