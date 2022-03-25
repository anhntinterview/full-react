// import Table from 'components/Table';
import Table from './table';
import React from 'react';
import { TableToggleAllRowsSelectedProps, Row, Column } from 'react-table';
import { generateData } from './TableFN';

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
                <input type="checkbox" ref={resolvedRef} {...rest} />
            </>
        );
    }
);

const RenderTextCenter = ({ text }: { text: string | any }) => {
    return <p className=" h-full flex justify-center items-center  cursor-default">{text}</p>;
};

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

    return (
        <input
            className="w-full h-full bg-transparent text-center"
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
    );
};

const Training = () => {
    const columns = React.useMemo(
        () => [
            {
                Header: ({
                    getToggleAllRowsSelectedProps,
                }: {
                    getToggleAllRowsSelectedProps: any;
                }) => (
                    <div className="flex items-center justify-between border-r border-gray-300 py-ooolab_p_2">
                        <IndeterminateCheckbox
                            {...getToggleAllRowsSelectedProps()}
                        />
                        <p className="ml-ooolab_m_1 text-blue-500 cursor-default">
                            Student Id
                        </p>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                ),
                accessor: 'id',
                Cell: ({ row }: { row: Row }) => (
                    <div className="border-r border-gray-300 flex items-center justify-between h-full py-ooolab_p_3  font-normal">
                        <IndeterminateCheckbox
                            {...row.getToggleRowSelectedProps()}
                        />
                        <p className="text-blue-500 cursor-default">{row.values.id}</p>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                ),
            },
            {
                Header: () => (
                    <p className="py-ooolab_p_2 h-full cursor-default">Student Name</p>
                ),
                accessor: 'name',
                Cell: ({ row, column }: { row: Row; column: Column }) => {
                    // return <RenderTextCenter text={row.values.name} />;
                    return (
                        <EditableCell
                            row={row}
                            column={column}
                            updateMyData={() => {}}
                            value={row.values.name}
                        />
                    );
                },
            },
            {
                Header: () => (
                    <p className="py-ooolab_p_2 h-full cursor-default">Parent Name</p>
                ),
                accessor: 'parent_name',
                Cell: ({ row, column }: { row: Row; column: Column }) => {
                    // return <RenderTextCenter text={row.values.name} />;
                    return (
                        <EditableCell
                            row={row}
                            column={column}
                            updateMyData={() => {}}
                            value={row.values.name}
                        />
                    );
                },
            },
            {
                Header: () => <p className="py-ooolab_p_2 h-full cursor-default">Status</p>,
                accessor: 'status',
                Cell: ({ row }: { row: Row }) => (
                    <RenderTextCenter text={row.values.status} />
                ),
            },
            {
                Header: () => <p className="py-ooolab_p_2 h-full cursor-default">Center</p>,
                accessor: 'center',
                Cell: ({ row }: { row: Row }) => (
                    <RenderTextCenter text={row.values.center} />
                ),
            },
            {
                Header: () => <p className="py-ooolab_p_2 h-full cursor-default">Created</p>,
                accessor: 'created',
                Cell: ({ row }: { row: Row }) => (
                    <RenderTextCenter text={row.values.created} />
                ),
            },
        ],
        []
    );
    return (
        <div className="h-screen grid grid-cols-12">
            <div className="h-full col-span-2">left menu</div>
            <div className="h-full max-w-full col-span-10 pt-ooolab_p_20 ">
                <Table data={generateData()} columns={columns} />
            </div>
        </div>
    );
};

export default Training;
