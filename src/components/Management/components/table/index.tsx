import React from 'react';
import {
    useTable,
    useRowSelect,
    useFlexLayout,
    Row,
    Column,
} from 'react-table';
import './style.css';

const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
}: {
    value: any;
    row: Row;
    column: Column;
    updateMyData: Function;
}) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue);

    const onChange = (e: any) => {
        setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        updateMyData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return <input value={value} onChange={onChange} onBlur={onBlur} />;
};

const Table = ({
    columns,
    data,
    updateData,
}: {
    columns: Column<any>[];
    data: any;
    updateData?: any;
}) => {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        selectedFlatRows,
        state: { selectedRowIds },
    } = useTable(
        {
            columns,
            data,
            defaultColumn: {
                Cell: EditableCell,
            },
            updateData,
        },
        useRowSelect,
        useFlexLayout
    );

    return (
        <table className="w-full h-auto" {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th
                                className="border-t-0 border-ooolab_bar_color h-ooolab_h_10"
                                {...column.getHeaderProps()}
                            >
                                {column.render('Header')}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);

                    return (
                        <tr
                            // className={`${
                            //     row.index % 2 === 0 ? 'bg-gray-200' : ''
                            // }`}
                            className="group hover:bg-gray-50"
                            {...row.getRowProps()}
                        >
                            {row.cells.map((cell) => {
                                return (
                                    <td {...cell.getCellProps()}>
                                        {cell.render('Cell')}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default Table;
