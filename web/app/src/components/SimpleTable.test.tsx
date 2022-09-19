import React from 'react';
import { fireEvent, getAllByRole, getByText, render, screen } from '@testing-library/react';
import { SimpleTable, TableProps } from "components/SimpleTable";

// TODO: add more tests, organize better
test('[desktop] renders SimpleTable', async () => {

    const data: TableProps["data"] = [{
        guid: "1",
        customer: "customer1",
        serial_number: "s1"
    }, {
        guid: "12",
        customer: "customer2",
        serial_number: "s2"
    }]

    const { container } = render(<SimpleTable
        mobileView={false}
        head={[
            {
                key: 'guid',
                title: 'ID'
            },
            {
                key: 'customer',
                title: "Customer"
            },
            {
                key: 'serial_number',
                title: "Serial Number"
            }
        ]}
        data={data}/>
    );
    const rowsElements = screen.getAllByRole("row");
    expect(rowsElements.length).toEqual(2);

    rowsElements.forEach(r => expect(r).toBeInTheDocument());
    rowsElements.forEach((r, i) => {
        // eslint-disable-next-line testing-library/prefer-screen-queries
        const cells = getAllByRole(r, "cell", {});
        expect(cells.length).toEqual(3);

        Object.values(data[i]).forEach((v, cellIndex) => {
            // eslint-disable-next-line testing-library/prefer-screen-queries
            expect(getByText(cells[cellIndex], String(v))).toBeInTheDocument()
        })
    });

    // group by 'customer1'
    fireEvent.click(screen.getByText('customer1'));

    let customer1RowsElements = await screen.findAllByRole("row");
    expect(customer1RowsElements.length).toEqual(1);
    expect(await screen.findByText("customer1")).toBeInTheDocument();

    // check reset button
    // eslint-disable-next-line testing-library/no-node-access,testing-library/no-container
    const resetFilter = container.querySelector('button[name="reset"]');
    expect(resetFilter).toBeInTheDocument();
    fireEvent.click(resetFilter!);

    const customer1and2RowsElements = await screen.findAllByRole("row")
    expect(customer1and2RowsElements.length).toEqual(2);

    // check search input
    const searchInput = await screen.findByRole("search");
    expect(searchInput).toBeInTheDocument();
    fireEvent.input(searchInput, { target: { value: 'customer2' } });

    customer1RowsElements = await screen.findAllByRole("row");
    expect(customer1RowsElements.length).toEqual(1);
    expect(await screen.findByText("customer2")).toBeInTheDocument();

    // check search input with capital
    fireEvent.input(searchInput, { target: { value: 'Customer2' } });

    customer1RowsElements = await screen.findAllByRole("row");
    expect(customer1RowsElements.length).toEqual(1);
    expect(await screen.findByText("customer2")).toBeInTheDocument();

    // check search + group
    //TODO
});
