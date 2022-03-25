import { Transition } from '@headlessui/react';
import React, { Fragment } from 'react';
import { ColumnWithLooseAccessor, useTable, useRowSelect } from 'react-table';
import './table.css';

interface CustomPropsGetter {
    className?: string;
    style?: React.CSSProperties;
}

interface TableProps {
    rowProps?: CustomPropsGetter;
    headerProps?: CustomPropsGetter;
    columns: ColumnWithLooseAccessor[];
    data: any[];
    onClickRow: (e: any) => void;
    rowClass?: (row: any) => string;
    onDoubleClickRow?: (e: any) => void;
    className?: string;
    selectedRemove?: any;
}

const Table: React.FC<TableProps> = ({
    rowProps,
    columns,
    data,
    headerProps,
    onClickRow,
    rowClass,
    onDoubleClickRow,
    className,
    selectedRemove,
}) => {
    const { headerGroups, rows, prepareRow } = useTable(
        {
            columns,
            data,
        },
        useRowSelect
    );

    return (
        <>
            <table className={className || 'w-full h-1'}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr
                            {...headerGroup.getHeaderGroupProps({
                                ...headerProps,
                            })}
                        >
                            {headerGroup.headers.map((column, idx) => {
                                return (
                                    <th
                                        id={`col-header-${idx}`}
                                        {...column.getHeaderProps()}
                                        className="border-none"
                                    >
                                        {column.render('Header')}
                                    </th>
                                );
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody id="my-table-body" className="relative">
                    {rows.map((row, idx) => {
                        prepareRow(row);
                        const tmp: any = { ...row.original };
                        return (
                            // <Transition
                            //     key={`body-row-${idx}`}
                            //     show={tmp.id !== selectedRemove}
                            //     enter="ease-out duration-500"
                            //     enterFrom="opacity-0"
                            //     enterTo="opacity-100"
                            //     leave="ease-in duration-500"
                            //     leaveFrom="opacity-100"
                            //     leaveTo="opacity-0"
                            //     as={Fragment}
                            // >
                            <tr
                                onClick={() => {
                                    onClickRow(row.original);
                                }}
                                onDoubleClick={() => {
                                    if (onDoubleClickRow) {
                                        onDoubleClickRow(tmp.id);
                                    }
                                }}
                                {...row.getRowProps({
                                    ...rowProps,
                                    ...(rowClass
                                        ? {
                                              className: rowClass(row.original),
                                          }
                                        : {}),
                                })}
                            >
                                {row.cells.map((cell) => {
                                    return (
                                        <td {...cell.getCellProps()}>
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })}
                            </tr>
                            // </Transition>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
};

export default Table;
