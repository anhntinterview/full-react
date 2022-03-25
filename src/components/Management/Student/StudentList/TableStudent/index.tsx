// import Table from 'components/Table';
import Table from 'components/Management/components/table';
import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TableToggleAllRowsSelectedProps, Row, Column } from 'react-table';
import { mockGroupsData } from '../../../components/mock';

const IndeterminateCheckbox = React.forwardRef(
    (props: TableToggleAllRowsSelectedProps, ref: any) => {
        const { indeterminate, ...rest } = props;
        const defaultRef = React.useRef();
        const resolvedRef = ref || defaultRef;

        React.useEffect(() => {
            resolvedRef.current.indeterminate = indeterminate;
        }, [resolvedRef, indeterminate]);
        return (
            <>
                <input
                    className="w-ooolab_w_4 h-ooolab_h_4"
                    type="checkbox"
                    ref={resolvedRef}
                    {...rest}
                />
            </>
        );
    }
);

const RenderGroupsHeader = ({ value }: { value: string }) => (
    <p className="text-ooolab_sm text-ooolab_dark_1 leading-ooolab_24px font-semibold">
        {value}
    </p>
);

const RenderGroupStatus = ({ value }: { value: string }) => (
    <span className="px-ooolab_p_3 py-ooolab_p_1 bg-ooolab_alert_success_50 rounded-admin_type">
        {value}
    </span>
);

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
    const inputRef = useRef();

    const onChange = (e: any) => {
        setValue(e.target.value);
    };

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        const updateVal = !!value ? value : inputRef.current;
        updateMyData(index, id, updateVal);
        setValue(updateVal);
    };

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue);
        inputRef.current = initialValue;
    }, [initialValue]);

    return (
        <input
            className="w-full h-full bg-transparent pl-ooolab_p_5 font-normal"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
};

const TableGroups = () => {
    const param: { id: string } = useParams();
    const columns = React.useMemo(
        () => [
            {
                Header: ({
                    getToggleAllRowsSelectedProps,
                }: {
                    getToggleAllRowsSelectedProps: any;
                }) => (
                    <div className="flex items-center justify-between border-r border-ooolab_bar_color py-ooolab_p_2">
                        <IndeterminateCheckbox
                            {...getToggleAllRowsSelectedProps()}
                        />
                        <RenderGroupsHeader value="Student ID" />
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                ),
                accessor: 'id',
                Cell: ({ row }: { row: Row }) => (
                    <div className="border-r border-ooolab_bar_color flex items-center justify-between h-full py-ooolab_p_4 font-normal">
                        <IndeterminateCheckbox
                            {...row.getToggleRowSelectedProps()}
                        />
                        <Link
                            to={`/workspace/${param.id}/management/student/${row.values.id}`}
                            className="text-ooolab_blue_1 font-semibold cursor-pointer"
                        >
                            {row.values.id}
                        </Link>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                ),
                width: 120,
            },
            {
                Header: () => (
                    <div className="h-full pl-ooolab_p_5 flex items-center">
                        <RenderGroupsHeader value="Student Name" />
                    </div>
                ),
                accessor: 'student_name',
                Cell: ({ row, column }: { row: Row; column: Column }) => {
                    // return <RenderTextCenter text={row.values.name} />;
                    return (
                        <EditableCell
                            row={row}
                            column={column}
                            updateMyData={() => {}}
                            value={row.values.student_name}
                        />
                    );
                },
                width: 180,
            },
            {
                Header: () => (
                    <div className="h-full pl-ooolab_p_5 flex items-center">
                        <RenderGroupsHeader value="Parent Name" />
                    </div>
                ),
                accessor: 'parent_name',
                Cell: ({ row, column }: { row: Row; column: Column }) => {
                    // return <RenderTextCenter text={row.values.name} />;
                    return (
                        <EditableCell
                            row={row}
                            column={column}
                            updateMyData={() => {}}
                            value={row.values.parent_name}
                        />
                    );
                },
            },
            {
                Header: () => (
                    <div className="h-full flex items-center">
                        <RenderGroupsHeader value="Status" />
                    </div>
                ),
                accessor: 'status',
                Cell: ({ row }: { row: Row }) => (
                    <div className="h-full flex items-center cursor-default">
                        <RenderGroupStatus value={row.values.status} />
                    </div>
                ),
                width: 100,
            },
            {
                Header: () => (
                    <div className="h-full pl-ooolab_p_5 flex items-center">
                        <RenderGroupsHeader value="Groups" />
                    </div>
                ),
                accessor: 'group_name',
                Cell: ({ row, column }: { row: Row; column: Column }) => {
                    // return <RenderTextCenter text={row.values.name} />;
                    return (
                        <span className="cursor-default pl-ooolab_p_5">
                            {row.values.group_name}
                        </span>
                    );
                },
            },
        ],
        []
    );
    return <Table data={mockGroupsData} columns={columns} />;
};

export default TableGroups;
