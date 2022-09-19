import { useRef } from "react";
import machineData from "../data/machine_data.json"
import { SimpleTable } from "components/SimpleTable";
import { useResponsiveValue } from "../hooks/useResponsiveValue";

export const MachineTableContainer = () => {

    const data = useRef(machineData).current;

    const [responsiveValue] = useResponsiveValue();

    const mobileView = responsiveValue([true, false]);
    return <SimpleTable
        mobileView={mobileView}
        head={[{
            key: 'id',
            title: 'ID'
        },
            {
                key: 'customer',
                title: "Customer"
            }, {
                key: 'asset_type',
                title: "Asset"
            },
            { key: 'serial_number', title: "Serial Number" },
            { key: 'service_contract', title: "Service Contract" },
            { key: 'warranty', title: 'Warranty' }
        ]}
        data={data}/>;
}