import React, {
    useCallback,
    useContext,
    useEffect,
    useReducer,
    useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router';
import lodash, { toInteger } from 'lodash';
import {
    EyeIcon,
    PencilAltIcon,
    PhotographIcon,
    TrashIcon,
    XIcon,
} from '@heroicons/react/outline';

import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';
import {
    ACTIONS,
    ActionType,
    courseReducer,
    CourseReducerType,
    initValue,
} from './reducers';
import { getTimeFromNow } from 'utils/handleFormatTime';

import TagRender from 'components/TagRender';
import EditLesson from './component/EditLesson';

import CourseBG from 'assets/course-bg.jpg';
import CancelImage from 'assets/SVG/cancel.svg';
import SaveChanges from 'assets/SVG/save-changes.svg';
import Modal from 'components/Modal';
import ModalRename from './component/ModalRename';
import { Prompt } from 'react-router-dom';

import './style.css';
import PublishCourse from './component/PublishCourse';
import RenderGridLesson from './component/RenderGridLesson';
import ModalSelectImage from './component/ModalSelectImage';
import { ToastContainer } from 'react-toastify';
import { removeCourse, uploadImage } from './CourseDetailFN';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import ModalCreateCourse from './component/ModalCreateCourse';
import ModalUpdateCourse from './component/ModalUpdateCourse';
import ActionsCircleButton from 'components/ActionsCircleButton';
import { StatusContent } from 'constant/util.const';

const statusShadow: Record<any, string> = {
    draft: 'shadow-ooolab_lesson_status bg-ooolab_dark_50 ',
    pending: 'shadow-ooolab_lesson_status_pending bg-ooolab_warning',
    public: 'shadow-ooolab_alert_success bg-ooolab_alert_success',
};

const NormalButton = ({
    content,
    onClickButton,
    isDisabled = false,
}: {
    content: string;
    onClickButton?: () => void;
    isDisabled?: boolean;
}) => {
    return (
        <button
            disabled={isDisabled}
            onClick={() => {
                if (onClickButton) onClickButton();
            }}
            className="bg-ooolab_blue_1 text-white ml-ooolab_m_2 px-ooolab_p_3 py-ooolab_p_1_e mr-ooolab_m_2 text-ooolab_sm rounded-lg disabled:bg-ooolab_dark_50"
        >
            {content}
        </button>
    );
};

const RenderActionButton = ({
    icon,
    onclick,
}: {
    icon: React.ReactNode;
    onclick?: () => void;
}) => {
    return (
        <button
            onClick={() => {
                if (onclick) onclick();
            }}
            className="w-ooolab_w_8 h-ooolab_h_8 mr-ooolab_m_1 p-ooolab_p_2 hover:bg-ooolab_light_blue_0 hover:text-ooolab_blue_7 active:bg-ooolab_blue_1 active:text-white active:outline-none rounded-full group"
        >
            {icon}
        </button>
    );
};

const CourseDetail: React.FC = ({ children }) => {
    const userInfo = getLocalStorageAuthData();
    const params: { courseId: string; id: string } = useParams();
    const history = useHistory();
    const { t: translator } = useTranslation();

    const {
        dispatch,
        getWorkspaceDetailState: {
            course,
            tagList,
            result: workspaceDetail,
            tagResult,
        },
    } = useContext(GetWorkspaceContext);

    const { detail, updateDetailStatus, loadingDetail } = course;

    const [courseParams, dispatchCourseParams] = useReducer<
        React.Reducer<CourseReducerType, ActionType>
    >(courseReducer, initValue(params.courseId));
    // modal state
    const [modalSuccess, setModalSuccess] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [modalRename, setModalRename] = useState(false);
    const [modalSelectImage, setModalSelectImage] = useState(false);
    const [modalConfirmDelete, setModalConfirmDelete] = useState(false);
    const [modalCreateCoure, setModalCreateCourse] = useState(false);
    const [modalUpdateCourse, setModalUpdateCourse] = useState(false);
    const [prevAdmin, setPrevAdmin] = useState(false);

    const handleAddLessons = (e: { lesson_uid: string }[]) => {
        dispatchCourseParams({
            type: ACTIONS.ADD_LESSONS,
            value: e,
        });
    };

    const handleUpdateCourse = useCallback(() => {
        setTimeout(() => setModalUpdateCourse(true), 500);
        let deletedTags: number[] = [];
        let addedTags: number[] = [];

        //tags received from api
        const originListTags = detail?.tags?.length
            ? detail.tags.map((i) => i.id)
            : [];
        //tags user interacted before submitting
        const modifiedListTags = courseParams.tags.map((i) => i.id);
        if (!modifiedListTags.length && !originListTags.length) {
            deletedTags = [];
            addedTags = [];
        }

        if (!modifiedListTags.length && originListTags.length) {
            addedTags = [];
            deletedTags = originListTags;
        }

        if (modifiedListTags.length && !originListTags.length) {
            deletedTags = [];
            addedTags = modifiedListTags;
        }

        if (modifiedListTags.length && originListTags.length) {
            addedTags = [
                ...lodash.difference(modifiedListTags, originListTags),
            ];
            originListTags.forEach((i) => {
                if (!modifiedListTags.includes(i)) {
                    deletedTags.push(i);
                }
            });
        }
        if (courseParams.courseBackgroundImage?.file) {
            uploadImage(
                courseParams.courseBackgroundImage.file,
                courseParams.courseBackgroundImage.canvas,
                (e) => {
                    workspaceMiddleware.updateDetailCourse(
                        dispatch,
                        params.id,
                        params.courseId,
                        { ...courseParams.params, thumbnail: e },
                        {
                            attachTags: {
                                tags: addedTags.map((i) => ({
                                    tag_id: i,
                                })),
                            },
                            detachTags: deletedTags,
                        }
                    );
                },
                () => {}
            );
        } else {
            workspaceMiddleware.updateDetailCourse(
                dispatch,
                params.id,
                params.courseId,
                { ...courseParams.params },
                {
                    attachTags: {
                        tags: addedTags.map((i) => ({
                            tag_id: i,
                        })),
                    },
                    detachTags: deletedTags,
                }
            );
        }
    }, [courseParams, courseParams.params, detail]);

    const handleAddTags = (e: number) => {
        const item = tagList.items.find((i) => i.id === e);
        const tmp = [...courseParams.tags, item];
        dispatchCourseParams({
            type: ACTIONS.ADD_TAGS,
            value: tmp,
        });
    };

    const handleRemoveTag = (e: number) => {
        const targetIndex = courseParams.tags.findIndex((i) => i.id === e);
        if (targetIndex !== -1) {
            const tmp = [...courseParams.tags];
            tmp.splice(targetIndex, 1);
            dispatchCourseParams({
                type: ACTIONS.REMOVE_TAGS,
                value: tmp,
            });
        }
    };
    const handleUploadCourseBackground = (
        file: File,
        canvas: HTMLCanvasElement
    ) => {
        dispatchCourseParams({
            type: ACTIONS.SET_THUMBNAIL,
            value: {
                file,
                canvas,
                result: canvas.toDataURL(),
            },
        });
    };

    const handleRemoveCourse = () => {
        return removeCourse(
            dispatch,
            params.id,
            toInteger(params.courseId),
            () => history.push(`/workspace/${params.id}/courses`)
        );
    };

    useEffect(() => {
        if (history.location?.state) {
            setPrevAdmin(false);
            const historyState: any = history.location.state;
            if (historyState?.prevPath) {
                if (historyState?.prevPath.split('/')[3] === 'admin') {
                    setPrevAdmin(true);
                }
            }
        }
        if (params.courseId !== 'new' && params.courseId) {
            workspaceMiddleware.getCourseDetail(
                dispatch,
                params.id,
                params.courseId
            );
        } else {
            dispatchCourseParams({
                type: ACTIONS.CAN_EDIT,
                value: true,
            });
        }
        // if (workspaceDetail.id === -1) {
        //     workspaceMiddleware.getWorkspace(dispatch, {
        //         id: params.id,
        //     });
        // }
        return () => {
            workspaceMiddleware.setCurrentRouteDetail(dispatch, []);
        };
    }, []);

    useEffect(() => {
        if (params.courseId !== 'new') {
            dispatchCourseParams({
                type: ACTIONS.SET_STATUS,
                value: 'init',
            });
            dispatchCourseParams({
                type: ACTIONS.SET_TAGS,
                value: detail?.tags || [],
            });
            dispatchCourseParams({
                type: ACTIONS.SET_LESSONS,
                value: detail?.lessons?.length ? detail.lessons : [],
            });
        }
        if (detail && params.courseId !== 'new') {
            if (workspaceDetail.id !== -1) {
                const {
                    membership: { user_id: currentUserId, role },
                } = workspaceDetail;
                dispatchCourseParams({
                    type: ACTIONS.CAN_EDIT,
                    value:
                        detail?.status === 'draft' &&
                        (detail.created_by.id === currentUserId ||
                            role.toLocaleLowerCase() === 'admin'),
                });
            }
            workspaceMiddleware.setCurrentRouteDetail(dispatch, [
                {
                    name: detail.title,
                    routeId: 'courseId',
                },
            ]);
        } else {
            workspaceMiddleware.setCurrentRouteDetail(dispatch, [
                {
                    name: 'New',
                    routeId: 'courseId',
                },
            ]);
        }
    }, [detail]);

    useEffect(() => {
        if (tagResult === 4) {
            dispatchCourseParams({
                type: ACTIONS.SET_TAGS,
                value: detail?.tags || [],
            });
        }
        console.log('tagResult', tagResult);
    }, [tagResult]);

    useEffect(() => {
        if (params.courseId !== 'new') {
            if (updateDetailStatus === 'init') {
                return;
            }
            if (updateDetailStatus === 'done' || tagResult === 4) {
                dispatchCourseParams({
                    type: ACTIONS.RESET,
                    value: 'init',
                });
                setModalSuccess(true);
            }
            if (
                updateDetailStatus === 'tags_error' ||
                updateDetailStatus === 'error'
            ) {
                setModalError(true);
            }
            workspaceMiddleware.getCourseDetail(
                dispatch,
                params.id,
                params.courseId
            );
        }
    }, [updateDetailStatus]);

    useEffect(() => {
        if (workspaceDetail.id !== -1 && params.courseId !== 'new') {
            const {
                membership: { user_id: currentUserId, role },
            } = workspaceDetail;
            dispatchCourseParams({
                type: ACTIONS.CAN_EDIT,
                value:
                    detail?.status === 'draft' &&
                    (detail.created_by.id === currentUserId ||
                        role.toLocaleLowerCase() === 'admin'),
            });
            dispatchCourseParams({
                type: ACTIONS.CAN_PUBLISH,
                value: role.toLocaleLowerCase() === 'admin',
            });
        }
    }, [workspaceDetail]);

    return (
        <div className="px-ooolab_p_16 w-full relative h-screen">
            <XIcon
                onClick={() => {
                    prevAdmin
                        ? history.push(`/workspace/${params.id}/admin`)
                        : history.push(`/workspace/${params.id}/courses`);
                }}
                className="w-ooolab_w_5 h-ooolab_h_5 absolute top-ooolab_inset_12px right-6 text-ooolab_dark_2 cursor-pointer"
            />
            {/* <Modal
                isOpen={modalSuccess}
                onClose={() => setModalSuccess(false)}
                title={UPDATE_MESSAGE[updateDetailStatus]}
                imgSrc={SaveChanges}
            /> */}
            {/* <Modal
                isOpen={modalError}
                onClose={() => setModalError(false)}
                title={UPDATE_MESSAGE[updateDetailStatus]}
                imgSrc={CancelImage}
            /> */}
            <ModalRename
                isOpen={modalRename}
                title={detail?.title || courseParams.params.title || ''}
                onClose={() => setModalRename(false)}
                onConfirm={(e) =>
                    dispatchCourseParams({
                        type: ACTIONS.SET_TITLE,
                        value: e,
                    })
                }
            />
            <ModalSelectImage
                onSubmitImage={handleUploadCourseBackground}
                isOpen={modalSelectImage}
                onClose={() => setModalSelectImage(false)}
            />

            <Modal
                isOpen={modalConfirmDelete}
                title={translator('MODALS.CONFIRM_DELETE_MODAL.TITLE_TEXT')}
                imgSrc={CancelImage}
                mainBtn={
                    <button
                        onClick={() => {
                            handleRemoveCourse();
                            setTimeout(() => setModalConfirmDelete(false), 300);
                        }}
                        className="px-ooolab_p_4 py-ooolab_p_1 bg-ooolab_blue_1 text-white rounded-lg text-ooolab_xs focus:outline-none"
                    >
                        {translator('MODALS.CONFIRM_DELETE_MODAL.YES_DO_IT')}
                    </button>
                }
                subBtn={
                    <button
                        onClick={() => setModalConfirmDelete(false)}
                        className="px-ooolab_p_4 py-ooolab_p_1 border rounded-lg text-ooolab_xs focus:outline-none"
                    >
                        {translator('MODALS.CONFIRM_DELETE_MODAL.NO_CANCEL')}
                    </button>
                }
                onClose={() => setModalConfirmDelete(false)}
            />
            <ModalCreateCourse
                isOpen={modalCreateCoure}
                onClose={() => setModalCreateCourse(false)}
                data={courseParams}
            />
            <ModalUpdateCourse
                isOpen={modalUpdateCourse}
                status={updateDetailStatus}
                onClose={() => setModalUpdateCourse(false)}
            />
            <ToastContainer />
            <Prompt
                when={courseParams.status === 'touched' && !modalCreateCoure}
                message={() => {
                    return `${translator('MODALS.UNSAVED_PROMPT')}`;
                }}
            ></Prompt>
            <div className="grid auto-rows-max grid-cols-6 gap-x-ooolab_w_8 ">
                <div className="col-span-4 h-ooolab_top_sidebar  flex items-center text-ooolab_xl font-semibold">
                    {children}
                    {/* {translator('COURSES.COURSE')} */}
                </div>
                <div className="col-span-2 h-ooolab_top_sidebar flex justify-end items-center ">
                    {(detail?.status === 'draft' &&
                        courseParams.canEdit &&
                        params.courseId !== 'new' && (
                            <NormalButton
                                onClickButton={handleUpdateCourse}
                                isDisabled={courseParams.status === 'init'}
                                content={translator('COURSES.SAVE')}
                            />
                        )) ||
                        null}
                    {(courseParams.canEdit && params.courseId === 'new' && (
                        <NormalButton
                            onClickButton={() => setModalCreateCourse(true)}
                            isDisabled={courseParams.status === 'init'}
                            content={translator('COURSES.CREATE')}
                        />
                    )) ||
                        null}
                    <PublishCourse
                        canPublish={courseParams.canPublish}
                        status={detail?.status}
                    />
                </div>
                <div className="col-span-2 rounded-ooolab_h5p w-full h-ooolab_below_top_sidebar overflow-y-visible shadow-ooolab_box_shadow_container px-ooolab_p_5 py-ooolab_p_5 custom-scrollbar">
                    <div className="h-3/6 w-full">
                        {/* course image and status */}
                        <div className="flex justify-between mb-ooolab_m_4">
                            <div
                                style={
                                    courseParams.courseBackgroundImage
                                        ? {
                                              backgroundImage: `url("${courseParams.courseBackgroundImage.result}")`,
                                              backgroundSize: 'cover',
                                              backgroundRepeat: 'no-repeat',
                                          }
                                        : {
                                              backgroundImage: `url("${
                                                  courseParams.params
                                                      .thumbnail ||
                                                  detail?.thumbnail
                                              }")`,
                                              backgroundSize: 'cover',
                                              backgroundRepeat: 'no-repeat',
                                          }
                                }
                                className="relative bg-gray-50 w-2/3 max-h-ooolab_h_45 min-h-ooolab_h_45 rounded-xl overflow-hidden filter group drop-shadow"
                            >
                                {(courseParams.canEdit && (
                                    <div className="hidden rounded-xl border border-dashed border-blue-400 top-0 left-0 cursor-pointer text-ooolab_dark_1 w-full h-full group-hover:absolute group-hover:block">
                                        <div
                                            onClick={() =>
                                                setModalSelectImage(true)
                                            }
                                            className="w-full h-2/3 flex items-center justify-center"
                                        >
                                            <button className="inline-flex items-center bg-gray-200 rounded-lg border py-ooolab_p_1_e px-ooolab_p_2">
                                                <PhotographIcon className="w-ooolab_w_4 h-ooolab_h_4" />
                                                <span>
                                                    {translator(
                                                        'COURSES.UPLOAD_IMAGE'
                                                    )}
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                )) ||
                                    null}
                                <div className="bg-img-course bg-no-repeat bg-cover absolute w-full bottom-0 left-0 z-20">
                                    <div className="w-full h-full px-ooolab_p_3 py-ooolab_p_2 bg-opacity-10 group-hover:bg-opacity-5 ">
                                        <p className="mb-ooolab_m_2 text-ooolab_xs text-ooolab_dark_2 opacity-0">
                                            {(detail &&
                                                getTimeFromNow(
                                                    detail.updated_on
                                                )) ||
                                                ''}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <p className="w-3/4 overflow-hidden overflow-ellipsis whitespace-nowrap text-ooolab_dark_1 font-medium text-ooolab_base">
                                                {courseParams.params.title ||
                                                    detail?.title}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="capitalize flex items-center h-ooolab_h_4 text-ooolab_xs text-ooolab_dark_2">
                                <span
                                    className={`w-ooolab_w_2_root h-ooolab_h_2 rounded-full mr-ooolab_m_2  ${
                                        statusShadow[detail?.status || 'draft']
                                    }`}
                                />
                                {StatusContent(translator, detail?.status) ||
                                    translator('STATUS_CONTENT.DRAFT')}
                            </p>
                        </div>
                        {/* Course action */}
                        <div
                            className={`  text-ooolab_dark_2 mb-ooolab_m_4 flex`}
                        >
                            <div
                                className={`${
                                    !courseParams.canEdit && 'hidden'
                                } `}
                            >
                                <ActionsCircleButton
                                    onclick={() => setModalRename(true)}
                                    icon={
                                        <PencilAltIcon className="w-ooolab_w_4 h-ooolab_h_4 " />
                                    }
                                />
                            </div>
                            {(((detail?.status !== 'public' &&
                                detail?.created_by?.id ===
                                    workspaceDetail.membership.user_id) ||
                                workspaceDetail.membership.role === 'admin') &&
                                params.courseId !== 'new' && (
                                    <ActionsCircleButton
                                        onclick={() =>
                                            setModalConfirmDelete(true)
                                        }
                                        icon={
                                            <TrashIcon className="w-ooolab_w_4 h-ooolab_h_4 " />
                                        }
                                    />
                                )) ||
                                null}
                        </div>

                        {/* author */}
                        <div className="flex items-center mb-ooolab_m_4 border border-ooolab_border_logout rounded-lg ">
                            <div className="border-r py-ooolab_p_1_e px-ooolab_p_3 rounded-lg text-ooolab_sm border-ooolab_bar_color">
                                {translator('COURSES.AUTHOR')}
                            </div>
                            <div className="flex items-center">
                                <img
                                    className="w-ooolab_w_5 h-ooolab_h_5 rounded-full mx-ooolab_m_2 "
                                    src={
                                        detail?.created_by
                                            ? detail.created_by.avatar_url
                                            : userInfo.avatar_url
                                    }
                                    alt=""
                                />
                                <p className="text-ooolab_dark_1">
                                    {detail?.created_by
                                        ? detail.created_by.display_name
                                        : userInfo.display_name}
                                </p>
                            </div>
                        </div>

                        {/* Full description */}
                        {(courseParams.canEdit && (
                            <div className="relative mb-ooolab_m_4 custom-scrollbar w-full mt-ooolab_m_4 border rounded-lg">
                                <span className="w-ooolab_w_25 border-b border-r text-ooolab_sm rounded-lg py-ooolab_p_1 absolute inline-flex justify-center items-center bg-white">
                                    {translator('COURSES.DESCRIPTIONS')}
                                </span>
                                <textarea
                                    defaultValue={
                                        detail?.full_description || ''
                                    }
                                    style={{
                                        textIndent: 'calc(110*(100vw/1440))',
                                        lineHeight: 2,
                                    }}
                                    rows={4}
                                    className="w-full h-full focus:outline-none px-ooolab_p_1_e"
                                    onChange={(e) =>
                                        dispatchCourseParams({
                                            type: ACTIONS.SET_DESCRIPTION,
                                            value: e.target.value || ' ',
                                        })
                                    }
                                />
                            </div>
                        )) ||
                            null}

                        {(!courseParams.canEdit && (
                            <div className="relative mb-ooolab_m_4 min-h-ooolab_h_18 w-full mt-ooolab_m_4 border rounded-lg pb-ooolab_p_1">
                                <span className="w-ooolab_w_25 border-b border-r text-ooolab_sm rounded-lg py-ooolab_p_1 absolute top-0 inline-flex justify-center items-center">
                                    {translator('COURSES.DESCRIPTIONS')}
                                </span>
                                <p className="custom-paragraph text-ooolab_dark_1 px-ooolab_p_1_e text-ooolab_xs">
                                    {detail?.full_description}
                                </p>
                            </div>
                        )) ||
                            null}

                        <div className="mb-ooolab_m_4">
                            <TagRender
                                title={translator('COURSES.TAG')}
                                isEditable={courseParams.canEdit}
                                onCheck={handleAddTags}
                                data={courseParams.tags}
                                onUnCheck={handleRemoveTag}
                            />
                        </div>

                        {/* Duration */}
                        {/* <div className="flex items-center mb-ooolab_m_4 border border-ooolab_border_logout rounded-lg">
                            <span className="px-ooolab_p_3 py-ooolab_p_1 text-ooolab_sm rounded-lg border-r border-ooolab_border_logout">
                                Durations
                            </span>
                            <span className="ml-ooolab_m_2 text-ooolab_dark_1 text-ooolab_xs">
                                {detail?.duration || 'asd'}
                            </span>
                        </div> */}
                    </div>
                </div>
                <div className="col-span-4 h-ooolab_below_top_sidebar px-ooolab_p_5 py-ooolab_p_6 shadow-ooolab_box_shadow_container rounded-3xl relative">
                    <p>
                        {translator('LESSON.TITLE')}
                        <span className="text-ooolab_xs text-ooolab_dark_1 ml-ooolab_m_2 rounded-sub_tab py-ooolab_p_1_e px-ooolab_p_2 bg-ooolab_light_blue_0">
                            {courseParams?.params?.lessons?.length ||
                                courseParams.lesson?.length ||
                                '0'}
                        </span>
                    </p>
                    <div className="h-auto max-h-full overflow-y-scroll custom-scrollbar py-ooolab_p_7">
                        {(courseParams.canEdit && (
                            <EditLesson
                                selectedLessonParams={
                                    courseParams.params.lessons
                                        ? [...courseParams.params.lessons]
                                        : [
                                              ...courseParams.lesson.map(
                                                  (i) => ({ lesson_uid: i.uid })
                                              ),
                                          ]
                                }
                                lessons={courseParams.lesson || detail?.lessons}
                                setLessons={handleAddLessons}
                            />
                        )) || (
                            <div className="grid grid-cols-3 gap-ooolab_w_5">
                                {detail?.lessons?.map((i) => (
                                    <div
                                        key={`grid-lesson-${i.id}`}
                                        className="col-span-1"
                                    >
                                        <RenderGridLesson data={i} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
