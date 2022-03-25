import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/outline';
import { ColumnWithLooseAccessor } from 'react-table';
import Table from '../../Table';
// import { data as mockData } from './mockData';

import AdminMenuBar from './components/AdminMenuBar';
import AdminFilterBar from './components/AdminFilterBar';
import AdminOptions from './components/AdminOptions';
import AdminSelectionBar from './components/AdminSelectionBar';
import { genClassNames } from 'utils/handleString';
import TablePagination from 'components/Pagination';
import { GetWorkspaceAdminContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { useHistory, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { WORKSPACE_ADMIN } from 'actions/workspace.action';
import { ParamsAdmin } from 'types/AdminWorkspace.type';
import { ToastContainer } from 'react-toastify';
import { errorNoti, successNoti } from 'components/H5P/H5PFN';
import { useTranslation } from 'react-i18next';

const Admin: React.FC = ({ children }) => {
    const { t: translator } = useTranslation();
    const [selected, displaySelected] = useState<any[]>([]);
    const [page, setPage] = useState<number>(-1);
    const [isOpening, setIsOpening] = useState<boolean>(false);
    const { getWorkspaceAdminState, dispatch } = useContext(
        GetWorkspaceAdminContext
    );
    const param: { id: string } = useParams();
    const history = useHistory();
    // useEffect(() => {
    //     workspaceMiddleware.getPendingAdminList(
    //         dispatch,
    //         param.id,
    //         getWorkspaceAdminState.order,
    //         page === -1 ? 1 : page + 1
    //     );
    // }, [getWorkspaceAdminState.order]);
    // useEffect(() => {
    //     if (page !== -1) {
    //         workspaceMiddleware.getPendingAdminList(
    //             dispatch,
    //             param.id,
    //             getWorkspaceAdminState.order,
    //             page + 1
    //         );
    //     }
    // }, [page]);

    useEffect(() => {
        workspaceMiddleware.getAdminList(
            dispatch,
            param.id,
            getWorkspaceAdminState.params
        );
    }, []);

    const changeSort = () => {
        const search: ParamsAdmin = {
            ...getWorkspaceAdminState.params,
            order:
                getWorkspaceAdminState.params.order == 'desc' ? 'asc' : 'desc',
        };

        workspaceMiddleware.getAdminList(dispatch, param.id, search);
    };

    const { time_zone } = getLocalStorageAuthData();
    const columns: ColumnWithLooseAccessor[] = React.useMemo(
        () => [
            {
                Header: () => (
                    <p className="font-normal text-left text-ooolab_sm">
                        {translator('NAME')}
                    </p>
                ),
                accessor: 'title', // accessor is the "key" in the data
                Cell: (d: any) => {
                    return (
                        <p
                            className="text-ooolab_dark_1 flex items-center justify-start text-ooolab_sm "
                            onDoubleClick={() =>
                                handleDoubleClick(d.row.original.id)
                            }
                        >
                            {d.value}
                        </p>
                    );
                },
            },
            {
                Header: () => (
                    <p
                        className="text-ooolab_blue_0 cursor-pointer font-normal flex items-center justify-start text-ooolab_sm"
                        onClick={changeSort}
                    >
                        {translator('LAST_MODIFIED')}
                        {getWorkspaceAdminState.params.order === 'desc' ? (
                            <ArrowDownIcon className="w-ooolab_w_4 h-ooolab_h_4 ml-1" />
                        ) : (
                            <ArrowUpIcon className="w-ooolab_w_4 h-ooolab_h_4 ml-1" />
                        )}
                    </p>
                ),
                accessor: 'updated_on',
                Cell: (d: any) => {
                    return (
                        <p className="text-ooolab_text_bar_inactive flex items-center justify-start">
                            {time_zone &&
                                dayjs
                                    .utc(d.value)
                                    .tz(time_zone)
                                    .locale('en-gb')
                                    .fromNow()}
                        </p>
                    );
                },
            },
            {
                Header: () => (
                    <p className="font-normal text-ooolab_sm text-left">
                        {translator('DASHBOARD.ADMIN_APPROVAL.TYPE')}
                    </p>
                ),
                accessor: 'content_type',
                Cell: (d: any) => {
                    switch (d.value) {
                        case 'lesson':
                            return (
                                <div className="text-left">
                                    <div className="text-ooolab_xs w-max  bg-ooolab_admin_lesson_type rounded-admin_type text-admin_lesson_type px-ooolab_p_2 py-ooolab_p_1">
                                        {translator(
                                            'DASHBOARD.ADMIN_APPROVAL.TYPE_LESSON'
                                        )}
                                    </div>
                                </div>
                            );
                        case 'h5p_content':
                            return (
                                <div className="text-left">
                                    <div className="text-ooolab_xs w-max  bg-ooolab_blue_0 rounded-admin_type text-admin_h5p_type px-ooolab_p_2 py-ooolab_p_1">
                                        {translator(
                                            'DASHBOARD.ADMIN_APPROVAL.TYPE_H5P'
                                        )}
                                    </div>
                                </div>
                            );
                        default:
                            return (
                                <div className="text-left">
                                    <div className="text-ooolab_xs w-max  bg-ooolab_pink_0 rounded-admin_type text-admin_course_type px-ooolab_p_2 py-ooolab_p_1">
                                        {translator(
                                            'DASHBOARD.ADMIN_APPROVAL.TYPE_COURSE'
                                        )}
                                    </div>
                                </div>
                            );
                    }
                },
            },
            {
                Header: () => (
                    <p className="font-normal text-ooolab_sm text-left">
                        {translator('DASHBOARD.ADMIN_APPROVAL.AUTHOR')}
                    </p>
                ),
                accessor: 'created_by',
                Cell: (d: any) => {
                    return (
                        <div className="flex items-center justify-start text-ooolab_text_bar_inactive">
                            <img
                                className="w-ooolab_w_6 h-ooolab_h_6 rounded-full bg-center bg-contain mr-2"
                                src={d.value.avatar_url}
                                alt=""
                            />
                            {d.value.display_name}
                        </div>
                    );
                },
            },
            {
                Header: () => (
                    <p className="font-normal text-ooolab_sm text-left">
                        {translator('STATUS')}
                    </p>
                ),
                accessor: 'status',
                Cell: (d: any) => {
                    return (
                        <div className="flex items-center justify-start">
                            <div className="bg-ooolab_warning w-ooolab_w_2_root h-ooolab_h_2 rounded-full shadow-ooolab_lesson_status_pending" />
                            <div className="ml-3 text-ooolab_text_bar_inactive text-ooolab_xs">
                                {translator('DASHBOARD.ADMIN_APPROVAL.PENDING')}
                            </div>
                        </div>
                    );
                },
            },
            {
                Header: () => <p className="font-normal"></p>,
                accessor: 'options',
                Cell: (d: any) => {
                    return (
                        <AdminOptions
                            onApprove={() => {
                                approve(d.row.original);
                            }}
                            onDecline={() => {
                                decline(d.row.original);
                            }}
                            onDisplayMenu={(open: boolean) =>
                                setIsOpening(open)
                            }
                        />
                    );
                },
            },
        ],
        [getWorkspaceAdminState]
    );

    const handleSearch = (content: string) => {
        const search: ParamsAdmin = {
            ...getWorkspaceAdminState.params,
            title: content,
            page: 1,
        };
        workspaceMiddleware.getAdminList(dispatch, param.id, search);
    };

    async function handlePagination(p: number) {
        const newParams = {
            ...getWorkspaceAdminState.params,
            page: p,
        };
        workspaceMiddleware.getAdminList(dispatch, param.id, newParams);
    }

    const handleDoubleClick = (content: any) => {
        if (getWorkspaceAdminState) {
            getWorkspaceAdminState.items.map((d) => {
                if (d.id === content) {
                    switch (d.content_type) {
                        case 'lesson':
                            return history.push(
                                `/workspace/${param.id}/lesson/${d.id}`,
                                { prevPath: history.location.pathname }
                            );
                        case 'h5p_content':
                            return history.push(
                                `/workspace/${param.id}/h5p-content/${d.id}`,
                                { prevPath: history.location.pathname }
                            );
                        case 'course':
                            return history.push(
                                `/workspace/${param.id}/course/${d.id}`,
                                { prevPath: history.location.pathname }
                            );
                        default:
                            break;
                    }
                }
            });
        }
    };

    const approve = useCallback(
        (data: any) => {
            displaySelected([]);
            setPage(-1);
            const returnFetch = workspaceMiddleware.adminApprove(
                dispatch,
                param.id,
                getWorkspaceAdminState.order,
                data.content_type,
                data.id
            );
            if (returnFetch) {
                errorNoti(
                    translator('DASHBOARD.ADMIN_APPROVAL.APPROVE_FAILED'),
                    <ExclamationCircleIcon />
                );
            } else {
                successNoti(
                    translator('DASHBOARD.ADMIN_APPROVAL.APPROVE_SUCCESS'),
                    <ExclamationCircleIcon />
                );
            }
        },
        [getWorkspaceAdminState.order]
    );
    const decline = useCallback(
        (data: any) => {
            displaySelected([]);
            setPage(-1);
            const returnFetch = workspaceMiddleware.adminDecline(
                dispatch,
                param.id,
                getWorkspaceAdminState.order,
                data.content_type,
                data.id
            );
            if (returnFetch) {
                errorNoti(
                    translator('DASHBOARD.ADMIN_APPROVAL.DECLINE_FAILED'),
                    <ExclamationCircleIcon />
                );
            } else {
                successNoti(
                    translator('DASHBOARD.ADMIN_APPROVAL.DECLINE_SUCCESS'),
                    <ExclamationCircleIcon />
                );
            }
        },
        [getWorkspaceAdminState.order]
    );
    return (
        <div className="px-ooolab_p_16 py-ooolab_p_6 pb-ooolab_p_2 w-full">
            <ToastContainer />
            <div className="grid auto-rows-max grid-cols-6 gap-2">
                <div className="col-span-6 flex items-center">
                    <AdminMenuBar onSubmit={handleSearch} children={children} />
                </div>

                <div className="flex flex-col col-span-6 px-ooolab_p_10 py-ooolab_p_5 shadow-ooolab_box_shadow_container rounded-3xl relative overflow-hidden h-ooolab_below_top_sidebar">
                    {selected.length > 0 ? (
                        <AdminSelectionBar
                            onApprove={() => approve(selected[0])}
                            onDecline={() => decline(selected[0])}
                            items={selected}
                            onClose={() => displaySelected([])}
                        />
                    ) : (
                        <AdminFilterBar />
                    )}

                    <Table
                        className="w-full flex-1"
                        columns={columns}
                        data={getWorkspaceAdminState.items}
                        rowProps={{
                            className:
                                'h-ooolab_h_10 text-left text-ooolab_sm hover:bg-ooolab_bg_bar hover:rounded-header_menu rounded-header_menu custom-row cursor-pointer admin',
                        }}
                        rowClass={(row: any) => {
                            return genClassNames({
                                'h-ooolab_h_10 text-left text-ooolab_sm hover:bg-ooolab_bg_bar hover:rounded-header_menu rounded-header_menu custom-row cursor-pointer admin': true,
                                'bg-ooolab_bg_bar': selected.some(
                                    (item: any) => item.uid === row.uid
                                ),
                            });
                        }}
                        onClickRow={(row: any) => {
                            if (!isOpening) {
                                if (
                                    selected.some(
                                        (item: any) => item.uid === row.uid
                                    )
                                ) {
                                    displaySelected(
                                        selected.filter(
                                            (item: any) => item.uid !== row.uid
                                        )
                                    );
                                } else {
                                    displaySelected([row]);
                                }
                            }
                        }}
                        // onDoubleClickRow={(e) => handleDoubleClick(e)}
                        headerProps={{
                            className:
                                ' text-ooolab_sm font-normal border-b border-ooolab_border_logout h-ooolab_h_10 admin',
                        }}
                    />

                    <div className="w-ooolab_w_90 ml-auto">
                        <TablePagination
                            total={getWorkspaceAdminState.total || 0}
                            perPage={10}
                            onClickPagination={handlePagination}
                            forcePage={
                                getWorkspaceAdminState.params.page &&
                                getWorkspaceAdminState.params.page - 1
                            }
                        />
                    </div>
                    {getWorkspaceAdminState.isLoading && (
                        <svg
                            className="animate-spin -ml-1 mr-3 w-ooolab_w_5 h-ooolab_h_5 opacity-100 absolute top-1/2 left-1/2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="red"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
