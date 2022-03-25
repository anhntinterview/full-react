import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import {
    ArrowDownIcon,
    ArrowUpIcon,
    ExclamationCircleIcon,
    PlusIcon,
} from '@heroicons/react/outline';
import { ColumnWithLooseAccessor } from 'react-table';

import { LessonOptions, LessonMenuBar, LessonDetail } from './components';
import LessonFilter from './LessonFilter';
// import { data as mockData } from './mockData';

import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { LESSON_ACTIONS } from './actions';
import { LessonInterface } from 'types/GetListOfWorkspace.type';
import { CheckboxType } from 'types/Lesson.type';

import Table from '../../Table';
import TablePagination from 'components/Pagination';
import LessonGridItem from './components/LessonGridItem';

import { getLessonFilterLocal } from 'utils/handleLocalStorage';
import {
    generateData,
    handleGetLessonsList,
    handleClickRow,
    handleCreateNewLesson,
    generateDefaultParam,
    lessonParamReducer,
} from './LessonFN';
import SwitchView from 'components/SwitchView';
import Tooltip from 'components/Tooltip';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { useTranslation } from 'react-i18next';

export interface ParamInterface {
    param: {
        page: number;
        per_page: number;
        sort_by: 'updated_on' | 'created_on' | 'title.keyword';
        order: 'desc' | 'asc';
        tag_id: string;
        title: string;
        created_by: string;
        // status: 'pending' | 'draft' | 'public' | 'archive' | 'trash';
    };
    hasNextPage: boolean;
    selectedTag: CheckboxType[];
    selectedAuthor: CheckboxType[];
}

const orderObj: Record<'desc' | 'asc', string> = {
    asc: 'desc',
    desc: 'asc',
};

const Lesson: React.FC = ({ children }) => {
    const { t: translator } = useTranslation();
    const history = useHistory();
    const params: { id: string } = useParams();
    const { dispatch: WorkspaceDispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );
    const [isGrid, setIsGrid] = useState(false);
    const {
        lessonList,
        lessonListStatus,
        currentLesson,
        result: WorkspaceDetailInformation,
    } = getWorkspaceDetailState;
    const data = React.useMemo(() => generateData(lessonList), [lessonList]);
    const [lessonParam, dispatch] = useReducer(
        lessonParamReducer,
        generateDefaultParam()
    );
    const [selectedRemove, setSelectedRemove] = useState<any>();
    const columns: ColumnWithLooseAccessor[] = React.useMemo(
        () => [
            {
                Header: () => (
                    <p className="font-normal text-left pl-ooolab_p_2">
                        {translator('LESSON.NAME')}
                    </p>
                ),
                accessor: 'title', // accessor is the "key" in the data
            },
            {
                Header: () => (
                    <p
                        onClick={() => {
                            dispatch({
                                type: LESSON_ACTIONS.SET_ORDER,
                                value: orderObj[lessonParam.param.order],
                            });
                        }}
                        className="text-ooolab_blue_0 cursor-pointer font-normal flex items-center justify-center"
                    >
                        {translator('LESSON.LAST_MODIFIED')}
                        {(lessonList.order === 'asc' && (
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
                    <p className="font-normal">{translator('LESSON.AUTHOR')}</p>
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
                            <LessonOptions
                                id={d.row.original.id}
                                workspace={params.id}
                                dispatch={WorkspaceDispatch}
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
        [lessonList, WorkspaceDetailInformation]
    );

    const handleSearch = (content: string) => {
        dispatch({ type: LESSON_ACTIONS.SET_TITLE, value: content });
    };

    const handleSetFilterMenu = (
        tags: CheckboxType[],
        authors: CheckboxType[]
    ) => {
        localStorage.setItem(
            'selected',
            JSON.stringify({
                authors,
                tags,
            })
        );
        dispatch({ type: LESSON_ACTIONS.SET_SELECTED_TAG, value: tags });
        dispatch({ type: LESSON_ACTIONS.SET_SELECTED_AUTHOR, value: authors });
        const newTagAndAuthors = {
            created_by: authors.filter((i) => i.check).map((i) => i.id),
            tag_id: tags.filter((j) => j.check).map((j) => j.id),
        };
        dispatch({
            type: LESSON_ACTIONS.SET_FILTER_MENU,
            value: newTagAndAuthors,
        });
    };

    const handleClickRowTable = (e: LessonInterface) => {
        handleClickRow(WorkspaceDispatch, e, params.id);
    };

    const handleDoubleClickRowTable = (lessonId: any) => {
        history.push(`/workspace/${params.id}/lesson/${lessonId}`);
    };

    const getLessonByPage = (selected: number) => {
        dispatch({
            type: LESSON_ACTIONS.SET_PAGE,
            value: selected,
        });
    };

    useEffect(() => {
        const dataLocal = getLessonFilterLocal();
        dispatch({
            type: LESSON_ACTIONS.SET_SELECTED_AUTHOR,
            value: dataLocal.authors,
        });
        dispatch({
            type: LESSON_ACTIONS.SET_SELECTED_TAG,
            value: dataLocal.tags,
        });

        handleGetLessonsList(WorkspaceDispatch, params.id, {
            ...lessonParam.param,
        });
    }, [lessonParam.param]);

    // useEffect(() => {
    //     if (WorkspaceDetailInformation.id === -1) {
    //         workspaceMiddleware.getWorkspace(WorkspaceDispatch, {
    //             id: params.id,
    //         });
    //     }
    // }, []);

    return (
        <div className="px-ooolab_p_16 w-full h-screen">
            <ToastContainer />
            <div className="grid auto-rows-max grid-cols-6 gap-x-8 h-full">
                {/* Search bar */}
                <div className="col-span-4 h-ooolab_top_sidebar flex items-center">
                    <LessonMenuBar
                        onSubmit={handleSearch}
                        children={children}
                    />
                </div>
                <div className="col-span-2 h-ooolab_top_sidebar flex items-center justify-end">
                    <button
                        onClick={() => {
                            workspaceMiddleware.setCurrentLesson(
                                WorkspaceDispatch,
                                undefined
                            );
                            history.push(`/workspace/${params.id}/lesson/new`);
                        }}
                        style={{ borderRadius: 10 }}
                        className="py-ooolab_p_1_e px-ooolab_p_3 bg-ooolab_blue_1 text-white flex items-center focus:outline-none"
                    >
                        <PlusIcon className="w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_2 " />
                        {translator('LESSON.NEW_LESSON')}
                    </button>
                </div>

                {/* List Lessons */}
                <div className="col-span-4 h-ooolab_below_top_sidebar px-ooolab_p_10 py-ooolab_p_5 shadow-ooolab_box_shadow_container rounded-3xl relative flex flex-col items-stretch">
                    <div className="h-ooolab_h_1/10">
                        <div className="h-ooolab_h_1/10">
                            {/* <LessonFilter
                                selectedTag={lessonParam.selectedTag}
                                selectedAuthor={lessonParam.selectedAuthor}
                                setFilterMenu={handleSetFilterMenu}
                            /> */}
                        </div>
                    </div>
                    <div className="h-4/5">
                        {(isGrid && (
                            <>
                                <div className="flex items-center text-ooolab_sm py-ooolab_p_4 border-b border-ooolab_border_logout">
                                    <p>{translator('LESSON.NAME')}</p>
                                    <p
                                        onClick={() => {
                                            dispatch({
                                                type: LESSON_ACTIONS.SET_ORDER,
                                                value:
                                                    orderObj[
                                                        lessonParam.param.order
                                                    ],
                                            });
                                        }}
                                        className="inline-flex items-center px-ooolab_p_5 cursor-pointer text-ooolab_blue_1"
                                    >
                                        <span>
                                            {translator('LESSON.LAST_MODIFIED')}
                                        </span>
                                        {(lessonParam.param.order === 'asc' && (
                                            <ArrowUpIcon className="w-ooolab_w_4 h-ooolab_h_4 ml-ooolab_m_1" />
                                        )) || (
                                            <ArrowDownIcon className="w-ooolab_w_4 h-ooolab_h_4 ml-ooolab_m_1" />
                                        )}
                                    </p>
                                    <p>{translator('LESSON.AUTHOR')}</p>
                                </div>
                                <div className="h-5/6 grid grid-cols-3 auto-rows-max gap-5 pt-ooolab_p_5 overflow-y-scroll custom-scrollbar">
                                    {data?.map((i) => (
                                        <div
                                            key={`grid-${i.id}`}
                                            className="col-span-1"
                                        >
                                            <LessonGridItem
                                                key={`grid-item-${i.id}`}
                                                data={i}
                                                onClick={handleClickRowTable}
                                                currentActiveId={
                                                    currentLesson?.id || -1
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )) || (
                            <Table
                                columns={columns}
                                data={data}
                                rowProps={{
                                    className:
                                        'h-ooolab_h_10 text-left text-ooolab_sm hover:bg-ooolab_bg_bar hover:rounded-sub_tab rounded-t-header_menu custom-row cursor-pointer',
                                }}
                                headerProps={{
                                    className:
                                        ' text-ooolab_sm font-normal border-b border-ooolab_border_logout h-ooolab_h_10',
                                }}
                                onClickRow={handleClickRowTable}
                                onDoubleClickRow={handleDoubleClickRowTable}
                                selectedRemove={selectedRemove}
                            />
                        )}
                    </div>
                    <div className="h-ooolab_h_1/10 flex justify-between items-end opacity-100">
                        <div className="w-1/4">
                            <SwitchView
                                isGrid={isGrid}
                                onChange={setIsGrid}
                                textLeft={translator('LIST')}
                                textRight={translator('GRID')}
                            />
                        </div>
                        <div className="w-2/4">
                            <TablePagination
                                total={lessonList.total}
                                perPage={lessonList.per_page}
                                onClickPagination={getLessonByPage}
                            />
                        </div>
                    </div>
                    {lessonListStatus === 'loading' && (
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
                    {/* <LessonSwitchView /> */}
                </div>

                {/* Lesson detail */}
                <div className="col-span-2 h-ooolab_below_top_sidebar max-h-ooolab_below_top_sidebar rounded-ooolab_h5p overflow-y-scroll custom-scrollbar w-full  shadow-ooolab_box_shadow_container flex flex-col items-center justify-center">
                    {(!currentLesson && (
                        <>
                            <ExclamationCircleIcon className="w-ooolab_w_12 h-ooolab_h_12 text-ooolab_dark_2" />
                            <p className="text-xl text-ooolab_dark_2">
                                {translator('LESSON.SELECT_LESSON')}
                            </p>
                        </>
                    )) || (
                        <LessonDetail
                            setSelectedRemove={setSelectedRemove}
                            currentWorkspace={params.id}
                            data={currentLesson}
                            dispatch={WorkspaceDispatch}
                            canRemove={
                                (currentLesson?.status !== 'public' &&
                                    currentLesson?.created_by.id ===
                                        WorkspaceDetailInformation.membership
                                            .user_id) ||
                                WorkspaceDetailInformation.membership.role ===
                                    'admin'
                            }
                        />
                    )}
                </div>
            </div>
            {/* <div className="m-ooolab_m_12">
                <SectionH5P section={undefined} />
            </div> */}
        </div>
    );
};

export default Lesson;

// box-shadow: 0px 0px 2px 0px rgba(40, 41, 61, 0.04);
