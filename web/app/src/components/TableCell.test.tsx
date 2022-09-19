import React from 'react';
import { render, screen } from '@testing-library/react';
import { TableCell } from "components/TableCell";

test('renders table cell', () => {
    render(<TableCell>hello</TableCell>);
    const linkElement = screen.getByText(/hello/i)
    expect(linkElement).toBeInTheDocument();
});
