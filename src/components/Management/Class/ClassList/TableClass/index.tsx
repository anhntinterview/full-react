// import Table from 'components/Table';
import Table from 'components/Management/components/table';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import React, { useContext, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    TableToggleAllRowsSelectedProps,
    Row,
    Column,
    ColumnWithLooseAccessor,
} from 'react-table';
import { mockGroupsData } from '../../../components/mock';
import { useTranslation } from 'react-i18next';

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
    <div className="h-full pl-ooolab_p_1_e flex items-center">
        <p className=" text-ooolab_sm text-ooolab_dark_1 leading-ooolab_24px font-semibold">
            {value}
        </p>
    </div>
);

const FormatColumnValue = ({ children }) => (
    <p className="overflow-ellipsis whitespace-nowrap overflow-hidden pl-ooolab_p_1_e py-ooolab_p_1 font-normal text-ooolab_dark_1 text-ooolab_1xs leading-ooolab_24px">
        {children}
    </p>
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

interface TableClassProps {
    data: any[];
}

const TableGroups: React.FC<TableClassProps> = ({ data }) => {
    const { t: translator } = useTranslation();

    const { getWorkspaceDetailState } = useContext(GetWorkspaceContext);

    const param: { id: string } = useParams();
    const columns: Column<any>[] = React.useMemo(
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

                        <RenderGroupsHeader
                            value={translator('CLASSES.CLASS_ID')}
                        />
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                ),
                accessor: 'id',
                Cell: ({ row }: { row: Row }) => (
                    <div className="border-r border-ooolab_bar_color flex items-center text-ooolab_xs justify-between h-full py-ooolab_p_3 font-semibold">
                        <IndeterminateCheckbox
                            {...row.getToggleRowSelectedProps()}
                        />
                        <Link
                            to={`/workspace/${param.id}/management/class/${row.values.id}`}
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
                    <RenderGroupsHeader
                        value={translator('CLASSES.CLASS_NAME')}
                    />
                ),
                accessor: 'name',
                Cell: ({ row, column }: { row: Row; column: Column }) => {
                    // return <RenderTextCenter text={row.values.name} />;
                    // return (
                    //     <EditableCell
                    //         row={row}
                    //         column={column}
                    //         updateMyData={() => {}}
                    //         value={row.values.name}
                    //     />
                    // );
                    return (
                        <FormatColumnValue>{row.values.name}</FormatColumnValue>
                    );
                },
            },
            {
                Header: () => (
                    <RenderGroupsHeader
                        value={translator('CLASSES.START_DATE')}
                    />
                ),
                accessor: 'start_date',
                Cell: ({ row, column }: { row: Row; column: Column }) => {
                    return (
                        <FormatColumnValue>
                            {row.values.start_date}
                        </FormatColumnValue>
                    );
                },
            },
            {
                Header: () => (
                    <RenderGroupsHeader
                        value={translator('CLASSES.END_DATE')}
                    />
                ),
                accessor: 'end_date',
                Cell: ({ row, column }: { row: Row; column: Column }) => {
                    return (
                        <FormatColumnValue>
                            {row.values.end_date}
                        </FormatColumnValue>
                    );
                },
            },

            {
                Header: () => (
                    <RenderGroupsHeader value={translator('CLASSES.VC_LINK')} />
                ),
                accessor: 'vc_link',
                Cell: ({ row, column }: { row: Row; column: Column }) => {
                    // return <RenderTextCenter text={row.values.name} />;
                    return (
                        <a
                            className="text-blue-600 hover:underline text-ooolab_xs font-normal pl-ooolab_p_1_e py-ooolab_p_1"
                            target="_blank"
                            href={row.values.vc_link}
                        >
                            {translator('CLASSES.JOIN_CLASS')}
                        </a>
                    );
                },
            },
        ],
        []
    );
    return <Table data={data} columns={columns} />;
};

export default TableGroups;
