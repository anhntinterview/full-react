import { FC, useContext, useMemo } from 'react';
import Table from 'components/Table';
import { ColumnWithLooseAccessor } from 'react-table';
import { CourseType } from 'types/Courses.type';
import { getTimeFromNow } from 'utils/handleFormatTime';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/outline';
import CourseContextOption from '../CourseOptionsContext';
import { useHistory, useParams } from 'react-router';
import { removeCourse } from '../../CourseListFN';
import Tooltip from 'components/Tooltip';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { useTranslation } from 'react-i18next';

interface IViewTable {
    data: CourseType[];
    handleChangeOrder: () => void;
    order: 'asc' | 'desc' | undefined;
    handleClickCourse: (e: CourseType) => void;
    workspaceId: string;
    workspaceDispatch: React.Dispatch<any>;
    selectedRemove: any;
}

const ViewTable: FC<IViewTable> = ({
    data,
    handleChangeOrder,
    order,
    handleClickCourse,
    workspaceId,
    workspaceDispatch,
    selectedRemove,
}) => {
    const history = useHistory();
    const { t: translator } = useTranslation();
    const params: { id: string } = useParams();
    const formatData = useMemo(() => {
        return data.map((i) => ({
            ...i,
            updated_on: getTimeFromNow(i.updated_on),
        }));
    }, [data]);

    const { getWorkspaceDetailState } = useContext(GetWorkspaceContext);
    const { result: WorkspaceDetailInformation } = getWorkspaceDetailState;

    const handleDoubleClickRowTable = (id: any) => {
        history.push(`/workspace/${params.id}/course/${id}`);
    };

    const columns: ColumnWithLooseAccessor[] = useMemo(
        () => [
            {
                Header: () => (
                    <p className="font-normal text-left pl-ooolab_p_2">
                        {translator('COURSES.NAME')}
                    </p>
                ),
                accessor: 'title', // accessor is the "key" in the data
            },
            {
                Header: () => (
                    <p
                        onClick={() => handleChangeOrder()}
                        className="text-ooolab_blue_0 cursor-pointer font-normal flex items-center justify-center"
                    >
                        {translator('COURSES.LAST_MODIFIED')}
                        {(order === 'asc' && (
                            <ArrowUpIcon className="w-ooolab_w_4 h-ooolab_h_4 ml-1" />
                        )) || (
                            <ArrowDownIcon className="w-ooolab_w_4 h-ooolab_h_4 ml-1" />
                        )}
                    </p>
                ),
                accessor: 'updated_on',
                Cell: (d: any) => {
                    return (
                        <p className="text-ooolab_text_bar_inactive flex items-center justify-center">
                            {d.value}
                        </p>
                    );
                },
            },
            {
                Header: () => (
                    <p className="font-normal">
                        {translator('COURSES.AUTHOR')}
                    </p>
                ),
                accessor: 'created_by',
                Cell: (d: any) => {
                    return (
                        <div className="flex justify-between ">
                            <span className="w-ooolab_w_0.0625"></span>

                            <Tooltip
                                title={d.value.display_name}
                                mlClass="ml-0"
                            >
                                <img
                                    className="w-ooolab_w_6 h-ooolab_h_6 rounded-full bg-center bg-contain"
                                    src={d.value.avatar_url}
                                    alt=""
                                />
                            </Tooltip>
                            <CourseContextOption
                                id={d.row.original.id}
                                workspace={workspaceId}
                                dispatch={workspaceDispatch}
                                canRemove={
                                    (d.row.original.status !== 'public' &&
                                        d.row.original.created_by.id ===
                                            WorkspaceDetailInformation
                                                .membership.user_id) ||
                                    WorkspaceDetailInformation.membership
                                        .role === 'admin'
                                }
                            />
                        </div>
                    );
                },
            },
        ],
        [data, WorkspaceDetailInformation]
    );

    return (
        <div className="h-full w-full">
            <Table
                columns={columns}
                data={formatData}
                onClickRow={handleClickCourse}
                onDoubleClickRow={handleDoubleClickRowTable}
                rowProps={{
                    className:
                        'h-ooolab_h_10 text-left text-ooolab_sm hover:bg-ooolab_bg_bar hover:rounded-sub_tab rounded-t-header_menu custom-row cursor-pointer',
                }}
                headerProps={{
                    className:
                        ' text-ooolab_sm font-normal border-b border-ooolab_border_logout h-ooolab_h_10',
                }}
                selectedRemove={selectedRemove}
            />
        </div>
    );
};

export default ViewTable;
