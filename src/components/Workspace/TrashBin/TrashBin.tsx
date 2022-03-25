import React, {
    Reducer,
    useContext,
    useEffect,
    useReducer,
    useState,
} from 'react';
// PACKAGES
import { SearchIcon, TrashIcon } from '@heroicons/react/solid';
import { Tab } from '@headlessui/react';
import { useParams } from 'react-router';
import { H5PContext } from 'contexts/H5P/H5PContext';
import { IH5PContentList } from 'types/H5P.type';
import TrashTableView from './TrashBinComponent/TrashTableView';
import h5pMiddlware from 'middleware/h5p.middlware';
import { ListParam } from 'types/ApiData.type';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import {
    generateDefaultParam,
    handleGetLessonsList,
    lessonParamReducer,
} from '../Lesson/LessonFN';
import workspaceMiddleware from 'middleware/workspace.middleware';
import {
    Actions,
    CourseParamsType,
    courseReducer,
    COURSE_ACTIONS,
} from '../CoursesList/reducer';
import {
    getCourseFilterLocal,
    getLocalStorageAuthData,
} from 'utils/handleLocalStorage';
import TrashOptions from './TrashBinComponent/TrashOptions';
import h5pService from 'services/h5p.service';
import workspaceService from 'services/workspace.service';
import { ICourseResponse } from 'types/Courses.type';
import { Lesson } from 'types/GetListOfWorkspace.type';

import { toast, ToastContainer } from 'react-toastify';
import NotificationLabel from 'components/Notification/NotificationLabel/NotificationLabel';
import { debounce } from 'lodash';
import { handleRole } from 'components/H5P/H5PFN';
import { BackspaceIcon } from '@heroicons/react/outline';

import comingsoon from 'assets/SVG/comingsoon.svg';

import { useTranslation } from 'react-i18next';

const generateDefaultParamCourse = (): CourseParamsType => {
    const local = getCourseFilterLocal();

    return {
        title: local.title,
        page: 1,
        order: 'desc',
        created_by: local.selectedAuthors.map((i) => i.id).join(','),
        tag_id: local.selectedTags.map((i) => i.id).join(','),
        selectedAuthors: local.selectedAuthors,
        selectedTags: local.selectedTags,
    };
};

const TrashBin: React.FC = ({ children }) => {
    const { t: translator } = useTranslation();
    const paramsUrl: { id: string } = useParams();
    const h5PCtx = useContext(H5PContext);

    const [contentList, setContentList] = useState<IH5PContentList>({
        items: [],
        order: undefined,
        page: undefined,
        per_page: undefined,
        sort_by: undefined,
        total: undefined,
    });

    const userInfo = getLocalStorageAuthData();

    const [lessonsContent, setLessonsContent] = useState<Lesson>();

    const [courseContent, setCourseContent] = useState<ICourseResponse>();

    const { dispatch: workspaceDispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );

    const [selectedTabs, setSelectedTabs] = useState<number>(0);

    const [selected, setSelected] = useState<number>();

    const [searchInput, setSearchInput] = useState<string>();

    const [adminRole, setAdminRole] = useState<boolean>(false);

    const [lessonParam, dispatch] = useReducer(
        lessonParamReducer,
        generateDefaultParam()
    );

    const [courseParams, dispatchCourseParam] = useReducer<
        Reducer<CourseParamsType, Actions>
    >(courseReducer, generateDefaultParamCourse());
    const {
        dispatch: h5pDispatch,
        H5PState: { h5PContentListResult, params },
    } = h5PCtx;

    const {
        lessonList,
        course: { list: courseList },
    } = getWorkspaceDetailState;

    useEffect(() => {
        h5pMiddlware.h5pResetStatus(h5pDispatch);
        handleRole(paramsUrl.id).then(
            (res) => res.role === 'admin' && setAdminRole(true)
        );
    }, []);

    useEffect(() => {
        const newParams: ListParam = {
            ...params,
            status: 'trash',
            created_by: !adminRole ? userInfo.id?.toString() : '',
        };
        const copyParams = Object.assign({}, courseParams);
        h5pMiddlware.h5pContentList(h5pDispatch, paramsUrl.id, newParams);
        handleGetLessonsList(workspaceDispatch, paramsUrl.id, {
            ...lessonParam.param,
            status: 'trash',
            created_by: !adminRole ? userInfo.id?.toString() : '',
        });
        workspaceMiddleware.getCoursesList(workspaceDispatch, paramsUrl.id, {
            ...copyParams,
            status: 'trash',
            created_by: !adminRole ? userInfo.id?.toString() : '',
        });
    }, [adminRole]);

    useEffect(() => {
        if (h5PContentListResult) {
            setContentList(h5PContentListResult);
        }
    }, [h5PContentListResult]);

    useEffect(() => {
        if (lessonList) {
            setLessonsContent(lessonList);
        }
    }, [lessonList]);

    useEffect(() => {
        if (courseList) {
            setCourseContent(courseList);
        }
    }, [courseList]);

    function changeTabs(id: number) {
        setSelectedTabs(id);
        setSelected(undefined);
        setSearchInput(undefined);
    }

    function errorNoti(title: string) {
        toast(
            <NotificationLabel
                textContent={title}
                type="danger"
                imageContent={<BackspaceIcon />}
            />,
            {
                autoClose: 5000,
                hideProgressBar: true,
                closeButton: false,
                bodyStyle: {
                    padding: 0,
                },
                delay: 500,
                position: 'bottom-left',
                className: 'shadow-ooolab_box_shadow_2 min-w-ooolab_w_65',
            }
        );
    }
    const successNoti = (title: string) => {
        toast(
            <NotificationLabel
                textContent={title}
                type="success"
                imageContent={<BackspaceIcon />}
            />,
            {
                autoClose: 5000,
                hideProgressBar: true,
                closeButton: false,
                bodyStyle: {
                    padding: 0,
                },
                delay: 500,
                position: 'bottom-left',
                className:
                    'shadow-ooolab_box_shadow_2 min-w-ooolab_w_65 rounded-3xl',
            }
        );
    };

    function handleRestore() {
        if (selected) {
            switch (selectedTabs) {
                case 0:
                    h5pService
                        .recoverH5P(paramsUrl.id, selected)
                        .then((res) => {
                            if (res) {
                                setContentList({
                                    items: contentList?.items?.filter(
                                        (c) =>
                                            c.contentId != selected.toString()
                                    ),
                                    order: contentList?.order,
                                    page: contentList?.page,
                                    per_page: contentList?.per_page,
                                    sort_by: contentList?.sort_by,
                                    total: contentList?.total,
                                });
                                successNoti(
                                    translator(
                                        'DASHBOARD.TRASH_BIN.H5P_RESTORE_SUCCESS'
                                    )
                                );
                                setSelected(undefined);
                            } else {
                                errorNoti(
                                    translator(
                                        'DASHBOARD.TRASH_BIN.H5P_RESTORE_FAILED'
                                    )
                                );
                                setSelected(undefined);
                            }
                        });
                    break;
                case 1:
                    if (lessonsContent) {
                        workspaceService
                            .recoverLesson(paramsUrl.id, selected.toString())
                            .then((res) => {
                                if (res) {
                                    setLessonsContent({
                                        items: lessonsContent?.items?.filter(
                                            (c) => c.id !== selected
                                        ),
                                        order: lessonsContent?.order,
                                        page: lessonsContent?.page,
                                        per_page: lessonsContent?.per_page,
                                        sort_by: lessonsContent?.sort_by,
                                        total: lessonsContent?.total,
                                    });
                                    successNoti(
                                        translator(
                                            'DASHBOARD.TRASH_BIN.LESSON_RESTORE_SUCCESS'
                                        )
                                    );
                                    setSelected(undefined);
                                } else {
                                    errorNoti(
                                        translator(
                                            'DASHBOARD.TRASH_BIN.LESSON_RESTORE_FAILED'
                                        )
                                    );
                                    setSelected(undefined);
                                }
                            });
                    }
                    break;
                case 2:
                    if (courseContent) {
                        workspaceService
                            .recoverCourseFromTrash(
                                paramsUrl.id,
                                selected.toString()
                            )
                            .then((res) => {
                                if (res) {
                                    setCourseContent({
                                        items: courseContent?.items?.filter(
                                            (c) => c.id !== selected
                                        ),
                                        page: courseContent?.page,
                                        per_page: courseContent?.per_page,
                                        sort_by: courseContent?.sort_by,
                                        total: courseContent?.total,
                                    });
                                    successNoti(
                                        translator(
                                            'DASHBOARD.TRASH_BIN.COURSE_RESTORE_SUCCESS'
                                        )
                                    );
                                    setSelected(undefined);
                                } else {
                                    errorNoti(
                                        translator(
                                            'DASHBOARD.TRASH_BIN.COURSE_RESTORE_FAILED'
                                        )
                                    );
                                    setSelected(undefined);
                                }
                            });
                    }
                    break;
                default:
                    break;
            }
        }
    }

    async function handlePagination(p: number) {
        switch (selectedTabs) {
            case 0:
                const newParams: ListParam = {
                    ...params,
                    status: 'trash',
                    page: p,
                    created_by: !adminRole ? userInfo.id?.toString() : '',
                };
                h5pMiddlware.h5pContentList(
                    h5pDispatch,
                    paramsUrl.id,
                    newParams
                );
                break;
            case 1:
                handleGetLessonsList(workspaceDispatch, paramsUrl.id, {
                    ...lessonParam.param,
                    status: 'trash',
                    page: p,
                    created_by: !adminRole ? userInfo.id?.toString() : '',
                });
                break;

            case 2:
                const copyParams = Object.assign({}, courseParams);
                workspaceMiddleware.getCoursesList(
                    workspaceDispatch,
                    paramsUrl.id,
                    {
                        ...copyParams,
                        status: 'trash',
                        page: p,
                        created_by: !adminRole ? userInfo.id?.toString() : '',
                    }
                );
                break;

            default:
                break;
        }
    }

    const [inputValue, setInputValue] = useState<string>();

    const debounceInput = React.useCallback(
        debounce((nextValue: string, asyncFunction: (p: string) => void) => {
            setInputValue(nextValue);
            asyncFunction(nextValue);
        }, 1000),
        []
    );

    function handleSearch(t: string) {
        switch (selectedTabs) {
            case 0:
                const newParams: ListParam = {
                    ...params,
                    title: t,
                    status: 'trash',
                    page: 1,
                };
                h5pMiddlware.h5pContentList(
                    h5pDispatch,
                    paramsUrl.id,
                    newParams
                );
                break;
            case 1:
                handleGetLessonsList(workspaceDispatch, paramsUrl.id, {
                    ...lessonParam.param,
                    title: t,
                    status: 'trash',
                    page: 1,
                });
                break;

            case 2:
                const copyParams = Object.assign({}, courseParams);
                workspaceMiddleware.getCoursesList(
                    workspaceDispatch,
                    paramsUrl.id,
                    {
                        ...copyParams,
                        title: t,
                        status: 'trash',
                        page: 1,
                    }
                );
                break;

            default:
                break;
        }
    }

    return (
        <div className="py-ooolab_p_4 px-ooolab_p_10 ">
            <ToastContainer />
            <div className="flex justify-between w-full mb-ooolab_m_6 ">
                <div className="flex items-center w-9/12">
                    <div className="w-1/8"> {children}</div>

                    {/* <p className="text-ooolab_xl font-semibold text-ooolab_dark_1">
                        {translator('DASHBOARD.TRASH_BIN.TRASH_BIN')}
                    </p> */}
                    <div className="bg-ooolab_gray_10 h-8 mx-ooolab_m_3 w-ooolab_w_2px" />
                    <div className="relative">
                        <input
                            className={` border-2 border-ooolab_border_logout rounded-sub_tab pl-ooolab_p_3 overflow-hidden ease-linear transition-transform duration-500 w-full h-ooolab_h_10 focus:outline-none pr-ooolab_p_9`}
                            type="text"
                            placeholder={translator('SEARCH')}
                            id="searchInput"
                            onChange={(e) =>
                                debounceInput(e?.target?.value, handleSearch)
                            }
                        />
                        <SearchIcon
                            className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 absolute cursor-pointer top-ooolab_inset_22 right-ooolab_inset_5 "
                            onClick={() => handleSearch(inputValue)}
                        />
                    </div>
                </div>
            </div>
            <div className="h-ooolab_below_top_sidebar">
                <div className="rounded-ooolab_card shadow-ooolab_box_shadow_container p-ooolab_p_5 relative">
                    <Tab.Group defaultIndex={0}>
                        <Tab.List
                            as="div"
                            style={{ display: 'flex', width: '100%' }}
                        >
                            <div className="w-9/12">
                                <Tab>
                                    <button
                                        className={`${
                                            selectedTabs === 0
                                                ? 'bg-ooolab_blue_1 text-white'
                                                : 'bg-white border border-ooolab_border_logout text-ooolab_dark_2'
                                        } px-ooolab_p_12 py-ooolab_p_1 rounded-sub_tab mr-ooolab_m_5`}
                                        onClick={() => changeTabs(0)}
                                    >
                                        H5P
                                    </button>
                                </Tab>
                                <Tab>
                                    <button
                                        className={`${
                                            selectedTabs === 1
                                                ? 'bg-ooolab_blue_1 text-white'
                                                : 'bg-white border border-ooolab_border_logout text-ooolab_dark_2'
                                        } px-ooolab_p_12 py-ooolab_p_1 rounded-sub_tab mr-ooolab_m_5`}
                                        onClick={() => changeTabs(1)}
                                    >
                                        {translator(
                                            'DASHBOARD.TRASH_BIN.LESSON'
                                        )}
                                    </button>
                                </Tab>
                                <Tab>
                                    <button
                                        className={`${
                                            selectedTabs === 2
                                                ? 'bg-ooolab_blue_1 text-white'
                                                : 'bg-white border border-ooolab_border_logout text-ooolab_dark_2'
                                        } px-ooolab_p_12 py-ooolab_p_1 rounded-sub_tab mr-ooolab_m_5`}
                                        onClick={() => changeTabs(2)}
                                    >
                                        {translator(
                                            'DASHBOARD.TRASH_BIN.COURSE'
                                        )}
                                    </button>
                                </Tab>
                            </div>
                            <div className="w-3/12 text-right">
                                {selected && (
                                    <TrashOptions
                                        selected={selected}
                                        setSelected={setSelected}
                                        selectedTabs={selectedTabs}
                                        handleRestore={handleRestore}
                                        translator={translator}
                                    />
                                )}
                            </div>
                        </Tab.List>

                        <Tab.Panels>
                            <Tab.Panel>
                                <TrashTableView
                                    contentList={contentList}
                                    setContentList={setContentList}
                                    selected={selected}
                                    setSelected={setSelected}
                                    handlePagination={handlePagination}
                                />
                            </Tab.Panel>
                            <Tab.Panel>
                                <TrashTableView
                                    contentList={lessonsContent}
                                    setContentList={setContentList}
                                    selected={selected}
                                    setSelected={setSelected}
                                    handlePagination={handlePagination}
                                />
                            </Tab.Panel>
                            <Tab.Panel>
                                <TrashTableView
                                    contentList={courseContent}
                                    setContentList={setContentList}
                                    selected={selected}
                                    setSelected={setSelected}
                                    handlePagination={handlePagination}
                                />
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </div>
    );
};

export default TrashBin;
