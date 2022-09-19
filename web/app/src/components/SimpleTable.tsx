import { TableRow } from "components/TableRow";
import { TableCell } from "components/TableCell";
import styled from "styled-components";
import { TableHeadRow } from "components/TableHeadRow";
import { TableHeadCell } from "components/TableHeadCell";
import { useCallback, useRef, useState, useTransition } from "react";

type HeadCellType = { key: string, title: string }
type CellType = { guid?: string; [key: string]: string | number | boolean | undefined }

export interface TableProps {
    head: Array<HeadCellType>;
    data: Array<CellType>;
    mobileView?: boolean;
}

// todo splitup
export const SimpleTable = ({ head, data, mobileView }: TableProps) => {

    const [filterData, setFilterData] = useState(data);
    const [, startTransition] = useTransition();
    const selectedColumn = useRef<string[] | undefined>(undefined);
    const searchValue = useRef<string | undefined>(undefined);

    const cellClick = useCallback((headCell: HeadCellType, cell: CellType) => {
        const fValue = String(cell[headCell.key]);
        selectedColumn.current = [headCell.key, fValue];
        onInput(searchValue.current || "");
        //TODO: change url to keep filter
    }, [data]);

    const onInput = (val: string) => {
        const searchVal = val?.toString().toLowerCase();
        startTransition(() => {
            setFilterData(() => {
                return data.filter(d => {
                    return (selectedColumn.current ? String(d[selectedColumn.current[0]]) === selectedColumn.current[1] : true)
                        && Object.values(d).some(v => String(v).toLowerCase().indexOf(searchVal) >= 0)
                });
            });

            searchValue.current = val;
            //TODO: change url to keep filter
        });
    }

    const onResetGroup = () => {
        selectedColumn.current = undefined;
        onInput(searchValue.current || "");
    }
    return <Container>
        <ControlContainer>

            <FilterContainer>
                {/*TODO: add pagination*/}
                <SearchContainer>
                    <input
                        role="search"
                        onInput={e => onInput((e.target as unknown as HTMLInputElement)?.value)}
                        type={"text"}
                        placeholder={"Search"}></input>
                </SearchContainer>
                <GroupContainer>
                    {selectedColumn.current ?
                        <button role="button" name="reset" onClick={() => onResetGroup()}>
                            {selectedColumn.current[0]}[{selectedColumn.current[1]}] x
                        </button> : null}
                </GroupContainer>
            </FilterContainer>
        </ControlContainer>
        {mobileView ? <GridBody>
                {
                    filterData.map((cell, index) => (<GridRowContainer key={cell.guid}>
                        {
                            head.map((headCell) => (
                                <TableRow key={(cell.guid + headCell.key) || index}>
                                    {/*TODO: add head cells per row, not for each cell?*/}
                                    <TableHeadCell key={"headcell_" + headCell.key}>{headCell.title}</TableHeadCell>
                                    <TableCell
                                        onClick={() => cellClick(headCell, cell)}
                                        key={String(headCell.key)}
                                        selected={selectedColumn.current?.[0] === headCell.key}
                                    >
                                        {String(cell[headCell.key])}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </GridRowContainer>))
                }
            </GridBody> :
            <Body>
                <TableHeadRow>
                    {
                        head.map((headCell) => (
                            <TableHeadCell key={headCell.key}>{headCell.title}</TableHeadCell>
                        ))
                    }
                </TableHeadRow>
                {
                    filterData.map((cell, index) => (<TableRow key={cell.guid || index}>
                            {
                                head.map((headCell) => (
                                    <TableCell
                                        onClick={() => cellClick(headCell, cell)}
                                        key={String(headCell.key)}
                                        selected={selectedColumn.current?.[0] === headCell.key}
                                    >
                                        {String(cell[headCell.key])}
                                    </TableCell>))
                            }
                        </TableRow>
                    ))
                }
            </Body>
        }
    </Container>
}

const Container = styled.div`

`

const ControlContainer = styled.div`
  display: flex;
  padding: 0.25rem 1rem;
`;

const FilterContainer = styled.div`
  margin: auto;
  display: flex;
`
const SearchContainer = styled.div`
`
const GroupContainer = styled.div`
`
const Body = styled.div`
  border-top: 1px solid black;
  text-align: end;
`

const GridBody = styled.div`
  border-top: 1px solid black;
  display: grid;
  text-align: start;
  grid-template-columns: repeat(auto-fill, minmax(350px, auto));
`

const GridRowContainer = styled.div`
  border-top: 1px solid black;
  display: grid;
`