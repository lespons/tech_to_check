import React from 'react';
import { render, screen } from '@testing-library/react';
import { TableHeadRow } from "components/TableHeadRow";
import { TableCell } from "components/TableCell";

test('renders table cell', () => {
    render(<TableHeadRow><TableCell>hello</TableCell></TableHeadRow>);
    const linkElement = screen.getByText(/hello/i);
    expect(linkElement).toBeInTheDocument();
});
