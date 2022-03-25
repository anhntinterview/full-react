import { useContext, useEffect, useReducer, useState, Reducer } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
    ExclamationCircleIcon,
    PlusIcon,
    TrashIcon,
} from '@heroicons/react/outline';

//Component
import TablePagination from 'components/Pagination';
import SwitchView from 'components/SwitchView';
import ViewGrid from './components/ViewGrid/';
import ViewTable from './components/ViewTable';
import ViewDetail from './components/ViewDetail';
import SearchInput from './components/SearchInput';

//Context
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';

//Middleware
import workspaceMiddleware from 'middleware/workspace.middleware';
import { CourseParam } from 'types/ApiData.type';
import {
    Actions,
    CourseParamsType,
    courseReducer,
    COURSE_ACTIONS,
} from './reducer';
import { CourseType } from 'types/Courses.type';
import CourseFilter from './CourseFilter';
import { CheckboxType } from 'types/Lesson.type';
import { getCourseFilterLocal } from 'utils/handleLocalStorage';
import workspaceService from 'services/workspace.service';
import { toast, ToastContainer } from 'react-toastify';
import NotificationWithUndo from 'components/Notification/NotificationWIthUndo';
import { removeCourse } from './CourseListFN';
import { useTranslation } from 'react-i18next';

const generateDefaultParam = (): CourseParamsType => {
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

const CoursesList: React.FC = ({ children }) => {
    const { t: translator } = useTranslation();
    const params: { id: string } = useParams();
    const history = useHistory();
    const { dispatch: workspaceDispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );
    const {
        course: { list: courseList, loading: courseLoading, detail },
        result: WorkspaceDetailInformation,
    } = getWorkspaceDetailState;

    const [isGrid, setIsGrid] = useState(false);
    const [courseParams, dispatchCourseParam] = useReducer<
        Reducer<CourseParamsType, Actions>
    >(courseReducer, generateDefaultParam());
    const [selected, setSelected] = useState<any>();
    const handleChangeOrder = () => {
        dispatchCourseParam({
            type: COURSE_ACTIONS.SET_ORDER,
            value: courseParams.order === 'asc' ? 'desc' : 'asc',
        });
    };

    const handleClickCourse = (e: CourseType) => {
        workspaceMiddleware.getCourseDetail(
            workspaceDispatch,
            params.id,
            e.id,
            e
        );
    };

    const handleSearchCourse = (e: string) => {
        const filterLocal = getCourseFilterLocal();
        const newFilter = {
            ...filterLocal,
            title: e,
        };
        localStorage.setItem('course-filter', JSON.stringify(newFilter));
        dispatchCourseParam({
            type: COURSE_ACTIONS.SET_TITLE,
            value: e,
        });
    };

    const handleSubmitFilter = ({
        tags,
        authors,
    }: {
        tags: CheckboxType[];
        authors: CheckboxType[];
    }) => {
        const filterLocal = getCourseFilterLocal();
        const newFilter = {
            ...filterLocal,
            selectedTags: tags,
            selectedAuthors: authors,
            created_by: authors,
        };
        localStorage.setItem('course-filter', JSON.stringify(newFilter));
        dispatchCourseParam({
            type: COURSE_ACTIONS.SET_TAGS_AND_AUTHORS,
            value: {
                tags,
                authors,
            },
        });
    };

    const handleRemoveCourse = (id: number) => {
        setSelected(id);
        return removeCourse(workspaceDispatch, params.id, id);
    };

    useEffect(() => {
        if (selected) {
            setTimeout(() => setSelected(undefined), 1000);
        }
    }, [courseList.items]);

    useEffect(() => {
        const copyParams = Object.assign({}, courseParams);
        delete copyParams.selectedAuthors;
        delete copyParams.selectedTags;
        workspaceMiddleware.getCoursesList(workspaceDispatch, params.id, {
            ...copyParams,
        });
    }, [courseParams]);

    // useEffect(() => {
    //     if (WorkspaceDetailInformation.id === -1) {
    //         workspaceMiddleware.getWorkspace(workspaceDispatch, {
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
                    <div className="w-1/8">{children}</div>
                    {/* <p className="text-ooolab_dark_1 font-semibold text-ooolab_xl">
                        {translator('COURSES.COURSES')}
                    </p> */}
                    <div
                        style={{ width: 1 }}
                        className="bg-ooolab_dark_50 h-8 mx-ooolab_m_3"
                    />
                    <SearchInput
                        defaultValue={courseParams.title}
                        onSubmit={handleSearchCourse}
                    />
                </div>
                <div className="col-span-2 h-ooolab_top_sidebar flex items-center justify-end">
                    <Link to={`/workspace/${params.id}/course/new`}>
                        <button className="rounded-lg py-ooolab_p_1_e px-ooolab_p_3 bg-ooolab_blue_1 text-white flex items-center focus:outline-none">
                            <PlusIcon className="w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_2 " />
                            {translator('COURSES.NEW_COURSE')}
                        </button>
                    </Link>
                </div>

                {/* List Lessons */}
                <div className="col-span-4 h-ooolab_below_top_sidebar px-ooolab_p_10 py-ooolab_p_5 shadow-ooolab_box_shadow_container rounded-3xl relative flex flex-col items-stretch">
                    <div className="h-ooolab_h_1/10 flex justify-end">
                        <CourseFilter
                            selectedAuthor={courseParams.selectedAuthors || []}
                            selectedTag={courseParams.selectedTags || []}
                            submitFilter={handleSubmitFilter}
                        />
                    </div>
                    <div className="h-4/5">
                        {isGrid ? (
                            <ViewGrid
                                data={courseList.items}
                                handleChangeOrder={handleChangeOrder}
                                handleClickCourse={handleClickCourse}
                                order={courseParams.order}
                                activeCourse={detail?.id || -1}
                            />
                        ) : (
                            <ViewTable
                                data={courseList.items}
                                handleChangeOrder={handleChangeOrder}
                                handleClickCourse={handleClickCourse}
                                order={courseParams.order}
                                workspaceId={params.id}
                                workspaceDispatch={workspaceDispatch}
                                selectedRemove={selected}
                            />
                        )}
                    </div>
                    <div className="h-ooolab_h_1/10 flex justify-between items-end opacity-100">
                        <div className="w-1/4">
                            <SwitchView
                                isGrid={isGrid}
                                onChange={() => setIsGrid((prev) => !prev)}
                                textLeft="List"
                                textRight="Grid"
                            />
                        </div>
                        <div className="w-2/4">
                            <TablePagination
                                total={courseList.total}
                                perPage={courseList.per_page}
                                onClickPagination={(e) =>
                                    dispatchCourseParam({
                                        type: COURSE_ACTIONS.SET_PAGE,
                                        value: e,
                                    })
                                }
                            />
                        </div>
                    </div>
                    {courseLoading && (
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
                <div className="col-span-2 max-h-ooolab_below_top_sidebar ooolab_below_top_sidebar rounded-ooolab_h5p overflow-y-scroll custom-scrollbar shadow-ooolab_box_shadow_container flex flex-col items-center justify-center">
                    {(detail && (
                        <div className="h-full  w-full p-ooolab_p_5">
                            <ViewDetail
                                data={detail}
                                removeCourse={handleRemoveCourse}
                                canRemove={
                                    WorkspaceDetailInformation.membership
                                        .role === 'admin' ||
                                    (detail.status !== 'public' &&
                                        detail.created_by.id ===
                                            WorkspaceDetailInformation
                                                .membership.user_id)
                                }
                            />
                        </div>
                    )) || (
                        <>
                            <ExclamationCircleIcon className="w-ooolab_w_12 h-ooolab_h_12 text-ooolab_dark_2" />
                            <p className="text-xl text-ooolab_dark_2">
                                {translator('COURSES.SELECT_COURSE')}
                            </p>
                        </>
                    )}
                </div>
            </div>
            {/* <div className="m-ooolab_m_12">
                <SectionH5P section={undefined} />
            </div> */}
        </div>
    );
};

export default CoursesList;
