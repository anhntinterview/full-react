// import Table from 'components/Table';
import { useBoolean } from 'hooks/custom';

import Pagination from 'components/Management/components/Pagination';
import Table from 'components/Management/components/table';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';
import React, {
    useContext,
    useEffect,
    useReducer,
    useRef,
    useState,
} from 'react';
import { useParams } from 'react-router-dom';
import { Row, Column } from 'react-table';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { UserContext } from 'contexts/User/UserContext';
import {
    ACTIONS,
    ActionType,
    editStateReducer,
    EditStateType,
    initSessionState,
    updateSession,
} from './util';
import { IClassSessionParams, ICLassSession } from 'types/Class.type';
import Modal from 'components/Modal';

import DeleteImg from 'assets/delete.png';
import classService from 'services/class.service';
import {
    EditableEndCell,
    EditableStartCell,
    RenderGroupsHeader,
    IndeterminateCheckbox,
} from './components/TableCustom';
import { SessionDateFormat, SessionServiceFormat } from 'constant/util.const';
import lodash from 'lodash';
import { useTranslation } from 'react-i18next';

dayjs.extend(utc);
dayjs.extend(CustomParseFormat);
dayjs.extend(timezone);

const FormatColumnValue = ({ children }) => (
    <p className="overflow-ellipsis whitespace-nowrap overflow-hidden pl-ooolab_p_1_e py-ooolab_p_1 font-normal text-ooolab_dark_1 text-ooolab_1xs leading-ooolab_24px">
        {children}
    </p>
);

const ClassSession = () => {
    const { t: translator } = useTranslation();

    const param: { id: string; classId: string } = useParams();
    const { dispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );
    const {
        userState: { result },
    } = useContext(UserContext);
    const { sessions } = getWorkspaceDetailState.class;
    const {
        membership: { role },
    } = getWorkspaceDetailState.result;
    const { page, per_page, total, items } = sessions;

    const [loadingSave, setLoadingSave] = useState(false);
    const toggleLoadingSave = (b?: boolean) => {
        setLoadingSave(b !== undefined ? b : !loadingSave);
    };

    const [sessionsState, setSessionsState] = useState<IClassSessionParams>(
        initSessionState
    );

    const [sessionData, setSessionData] = useState<ICLassSession[]>([]);

    const [editSessionState, dispatchEditSessionState] = useReducer<
        React.Reducer<EditStateType, ActionType>
    >(editStateReducer, {});

    const [canSave, setCanSave] = useState(false);

    useEffect(() => {
        setCanSave(
            !!Object.keys(editSessionState)?.length &&
                !lodash.isEqual(
                    sessionData.map((i) => ({
                        start_time: i.start_time,
                        end_time: i.end_time,
                        id: i.id,
                    })),
                    sessions.items.map((i) => {
                        const parseStartDate = dayjs
                            .utc(i.start_time)
                            .tz(result.time_zone);
                        const parseEndDate = dayjs
                            .utc(i.end_time)
                            .tz(result.time_zone);

                        return {
                            id: i.id,
                            start_time: parseStartDate.format(
                                SessionDateFormat
                            ),
                            end_time: parseEndDate.format(SessionDateFormat),
                        };
                    })
                )
        );
    }, [editSessionState, sessionData]);

    const handleEditSessionStartDateRecord = (d: {
        id: number;
        value: string;
        index: number;
    }) => {
        dispatchEditSessionState({
            type: ACTIONS.SET_NEW_START_RECORD,
            value: {
                id: d.id,
                start_time: d.value,
                index: d.index,
            },
        });
    };

    const handleEditSessionEndDateRecord = (d: {
        id: number;
        value: string;
        index: number;
    }) => {
        dispatchEditSessionState({
            type: ACTIONS.SET_NEW_END_RECORD,
            value: {
                id: d.id,
                end_time: d.value,
                index: d.index,
            },
        });
    };

    const handleResetSessionData = () => {
        workspaceMiddleware.getClassSessions(dispatch, {
            classId: param.classId,
            workspaceId: param.id,
            params: sessionsState,
        });
        dispatchEditSessionState({
            type: ACTIONS.RESET,
            value: { id: -1 },
        });
    };

    const {
        booleanValue: isRemoveSession,
        toggleBooleanValue: toggleIsRemoveSession,
    } = useBoolean();
    const sessionRef = useRef<any>(null);

    useEffect(() => {
        workspaceMiddleware.getClassSessions(dispatch, {
            classId: param.classId,
            workspaceId: param.id,
            params: sessionsState,
        });
    }, [sessionsState]);

    useEffect(() => {
        if (!toggleIsRemoveSession) {
            sessionRef.current = null;
        }
    }, [toggleIsRemoveSession]);

    useEffect(() => {
        const listKeys = Object.keys(editSessionState);

        if (listKeys.length) {
            const copiedSessionData = [...sessionData];
            listKeys.forEach((element) => {
                const editElement = editSessionState[element];
                if (editElement && copiedSessionData[editElement.index]) {
                    copiedSessionData[editElement.index] = {
                        ...copiedSessionData[editElement.index],
                        ...editElement,
                    };
                }
            });
            setSessionData(copiedSessionData);
        }
    }, [editSessionState]);

    useEffect(() => {
        const formatData = sessions.items.map((i) => {
            const parseStartDate = dayjs.utc(i.start_time).tz(result.time_zone);
            const parseEndDate = dayjs.utc(i.end_time).tz(result.time_zone);

            return {
                id: i.id,
                start_time: parseStartDate.format(SessionDateFormat),
                end_time: parseEndDate.format(SessionDateFormat),
            };
        });
        setSessionData(formatData);
        dispatchEditSessionState({ type: ACTIONS.RESET, value: { id: -1 } });
    }, [sessions]);

    const handleChangePagination = (e: number) => {
        setSessionsState((prev) => ({
            ...prev,
            page: e,
        }));
    };

    const handleRemoveSession = async () => {
        classService
            .deleteSessions(param.id, param.classId, sessionRef.current)
            .then(() => {
                workspaceMiddleware.getClassSessions(dispatch, {
                    classId: param.classId,
                    workspaceId: param.id,
                    params: sessionsState,
                });
            })
            .finally(() => {
                toggleIsRemoveSession();
            });
    };

    const handleUpdateSession = async () => {
        toggleLoadingSave();
        const listIds = Object.keys(editSessionState);
        const result = [];
        for (const i of listIds) {
            const start_time = editSessionState[i].start_time
                ? dayjs(editSessionState[i].start_time).format(
                      SessionServiceFormat
                  )
                : dayjs(
                      sessionData[editSessionState[i].index].start_time
                  ).format(SessionServiceFormat);
            const end_time = editSessionState[i].end_time
                ? dayjs(editSessionState[i].end_time).format(
                      SessionServiceFormat
                  )
                : dayjs(sessionData[editSessionState[i].index].end_time).format(
                      SessionServiceFormat
                  );
            result.push(
                await updateSession(param.id, param.classId, i, {
                    end_time,
                    start_time,
                })
            );
        }
        setTimeout(() => {
            toggleLoadingSave(false);
            dispatchEditSessionState({
                type: ACTIONS.RESET,
                value: { id: -1 },
            });
        }, 500);
    };

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
                            value={translator('CLASSES.SESSION_ID')}
                        />
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                ),
                accessor: 'id',
                Cell: ({ row }: { row: Row }) => (
                    <div className="border-r border-ooolab_bar_color flex items-center justify-between h-full py-ooolab_p_3 font-normal">
                        <IndeterminateCheckbox
                            {...row.getToggleRowSelectedProps()}
                        />
                        <p
                            // to={`/workspace/${param.id}/management/class/${row.values.id}`}
                            className="text-ooolab_blue_1 text-ooolab_xs font-semibold cursor-pointer"
                        >
                            {row.values.id}
                        </p>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                ),
                width: 120,
            },
            {
                Header: () => (
                    <div className="pl-ooolab_p_1_e h-full flex items-center">
                        <RenderGroupsHeader
                            value={translator('CLASSES.START_DATETIME')}
                        />
                    </div>
                ),
                accessor: 'start_time',
                Cell: ({ row, column }: { row: Row; column: Column }) => {
                    if (role === 'admin') {
                        return (
                            <EditableStartCell
                                key={`start-${row.values.id}`}
                                value={row.values.start_time}
                                row={row}
                                column={column}
                                updateMyData={handleEditSessionStartDateRecord}
                            />
                        );
                    }
                    return (
                        <FormatColumnValue key={row.values.id}>
                            {row.values.start_time}
                        </FormatColumnValue>
                    );
                },
                width: 180,
            },
            {
                Header: () => (
                    <div className="pl-ooolab_p_1_e h-full flex items-center">
                        <RenderGroupsHeader
                            value={translator('CLASSES.END_DATETIME')}
                        />
                    </div>
                ),
                accessor: 'end_time',
                Cell: ({ row, column }: { row: Row; column: Column }) => {
                    if (role === 'admin') {
                        return (
                            <EditableEndCell
                                key={`end-${row.values.id}`}
                                value={row.values.end_time}
                                row={row}
                                column={column}
                                updateMyData={handleEditSessionEndDateRecord}
                            />
                        );
                    }
                    return (
                        <FormatColumnValue key={row.values.id}>
                            {row.values.end_time}
                        </FormatColumnValue>
                    );
                },
                width: 180,
            },
            {
                Header: () => null,
                id: 'remove',
                Cell: ({ row, column }: { row: Row; column: Column }) => {
                    if (role === 'admin') {
                        return (
                            <div className="group-hover:block hidden">
                                {role === 'admin' && (
                                    <button
                                        onClick={() => {
                                            toggleIsRemoveSession();
                                            sessionRef.current = row.values.id;
                                        }}
                                        className="text-ooolab_xs py-ooolab_p_1_e px-ooolab_p_2 bg-ooolab_dark_300 rounded text-white"
                                    >
                                        {translator('CLASSES.REMOVE')}
                                    </button>
                                )}
                            </div>
                        );
                    }
                    return null;
                },
                width: 180,
            },
        ],
        [sessions, result]
    );

    return (
        <div className="w-full h-full relative grid grid-rows-layout_management_table">
            <Modal
                imgSrc={DeleteImg}
                isOpen={isRemoveSession}
                onClose={toggleIsRemoveSession}
                title="Confirm Remove Session"
                contentText="Are you sure you want to remove this session?"
                mainBtn={
                    <button
                        onClick={handleRemoveSession}
                        className="py-ooolab_p_1_e px-ooolab_p_4 bg-red-500 rounded text-white text-ooolab_xs"
                    >
                        {translator('CLASSES.YES_REMOVE')}
                    </button>
                }
                subBtn={
                    <button
                        onClick={toggleIsRemoveSession}
                        className="py-ooolab_p_1_e px-ooolab_p_4 border border-ooolab_dark_2 rounded text-ooolab_xs"
                    >
                        {translator('CLASSES.NO_CANCEL')}
                    </button>
                }
            />
            <div className="row-span-1 col-span-1 flex justify-end items-center">
                <button
                    disabled={!canSave}
                    type="button"
                    onClick={handleUpdateSession}
                    className="flex items-center mr-ooolab_m_2 rounded disabled:cursor-not-allowed disabled:opacity-40 py-ooolab_p_1_e px-ooolab_p_2 text-ooolab_xs shadow-ooolab_sched_button  text-ooolab_dark_1"
                >
                    {loadingSave ? (
                        <svg
                            className="animate-spin w-ooolab_w_5 h-ooolab_h_5 mr-ooolab_m_1 opacity-100"
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
                                fill="white"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                    ) : (
                        <span> {translator('CLASSES.SAVE')}</span>
                    )}
                </button>
                <button
                    onClick={handleResetSessionData}
                    disabled={!canSave}
                    className="rounded disabled:cursor-not-allowed disabled:opacity-40 mr-ooolab_m_2 py-ooolab_p_1_e px-ooolab_p_2 text-ooolab_xs shadow-ooolab_sched_button bg-ooolab_dark_300 text-white"
                >
                    {translator('CLASSES.CANCEL')}
                </button>
            </div>
            <div className="row-span-9 col-span-1 border-t border-ooolab_bar_color">
                <Table
                    data={sessionData}
                    columns={columns}
                    updateData={editSessionState}
                />
            </div>
            <div className="flex items-center justify-between row-span-1 col-span-1  border-t border-ooolab_border_logout">
                <p className="text-ooolab_dark_2 text-ooolab_xs font-semibold leading-ooolab_24px">
                    Showing {page * per_page - per_page + 1}-
                    {items.length + per_page * (page - 1)} of {total}
                </p>
                <div className="w-1/3 inline-flex justify-end">
                    <Pagination
                        onClickPagination={handleChangePagination}
                        perPage={per_page}
                        total={total}
                    />
                </div>
            </div>
        </div>
    );
};

export default ClassSession;
