import React, {
    useEffect,
    useContext,
    useReducer,
    useState,
    useCallback,
} from 'react';
import { Prompt, useParams, useHistory, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { PlusIcon, XIcon } from '@heroicons/react/outline';
import { debounce } from 'lodash';

import workspaceMiddleware from 'middleware/workspace.middleware';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';

import {
    ActionType,
    initialLesson,
    LessonBuilderType,
    LessonFormInterface,
    lessonReducer,
    LESSON_ACTIONS,
} from 'components/Workspace/LessonBuilder/utils';
import { handleGetLessonTags } from 'components/Workspace/Lesson/LessonFN';
import TagRender from 'components/TagRender';
import SectionView from './SectionView';
import { ChevronRightIcon } from '@heroicons/react/solid';
import { H5P_MODAL } from 'constant/modal.const';
import {
    approveLessonRequest,
    cancelApproval,
} from 'components/Workspace/LessonBuilder/LessonBuilderFN';
import { H5PModal } from 'components/H5P/H5PComponents';
import { useTranslation } from 'react-i18next';

const statusShadow: Record<any, string> = {
    draft: 'shadow-ooolab_lesson_status bg-ooolab_dark_50 ',
    pending: 'shadow-ooolab_lesson_status_pending bg-ooolab_warning',
    public: 'shadow-ooolab_alert_success bg-ooolab_alert_success',
};

const AdminViewDetailLesson = () => {
    const params: { id: string; lessonId: string } = useParams();
    const history = useHistory();
    const { dispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );
    const { t: translator } = useTranslation();
    const [isModal, setIsModal] = React.useState<boolean>(false);

    const [modalProps, setModalProps] = React.useState<{
        component: {
            type: string;
            title: string;
            subTitle: string;
            btnCancel: string;
            btnSubmit: string;
            color: string;
            img: string;
        };
        onFetch: () => Promise<void>;
    }>();

    const {
        currentLesson,
        tagList,
        isUpdatingLesson,
        updateStatus,
        result: workspaceDetail,
    } = getWorkspaceDetailState;

    const [lesson, dispatchLesson] = useReducer<
        React.Reducer<LessonBuilderType, ActionType>
    >(lessonReducer, initialLesson(''));

    const [modalSuccess, setModalSuccess] = useState(false);
    const [modalError, setModalError] = useState(false);

    useEffect(() => {
        workspaceMiddleware.getLessonDetail(
            dispatch,
            params.id,
            params.lessonId
        );
        // workspaceMiddleware.getWorkspace(dispatch, {
        //     id: params.id,
        // });
        handleGetLessonTags(dispatch, params.id);
    }, []);

    useEffect(() => {
        if (updateStatus === 'done') {
            setModalSuccess(true);
        } else if (updateStatus === 'error') {
            setModalError(true);
        }
    }, [isUpdatingLesson, updateStatus]);

    useEffect(() => {
        if (workspaceDetail.id !== -1) {
            const {
                membership: { user_id: currentUserId, role },
            } = workspaceDetail;
        }
    }, [workspaceDetail]);

    async function approve() {
        approveLessonRequest(dispatch, params.id, params.lessonId);
    }

    async function decline() {
        cancelApproval(dispatch, params.id, params.lessonId);
    }
    async function onDecline() {
        setIsModal(true);
        const modalProps = {
            component: H5P_MODAL.declineAdmin,
            onFetch: decline,
        };
        await setModalProps(modalProps);
    }

    async function onApprove() {
        setIsModal(true);
        const modalProps = {
            component: H5P_MODAL.approveAdmin,
            onFetch: approve,
        };
        await setModalProps(modalProps);
    }

    return (
        <div className="px-ooolab_p_16 w-full h-screen relative">
            <ToastContainer />
            <div className="grid auto-rows-max grid-cols-6 gap-2 h-full">
                <div className="col-span-5 h-ooolab_top_sidebar flex items-center text-ooolab_lg py-ooolab_p_1 font-semibold ">
                    <Link to={`/workspace/${params.id}/admin`}>
                        <p className="text-ooolab_xl font-semibold text-ooolab_dark_2">
                            Admin
                        </p>
                    </Link>
                    <ChevronRightIcon className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_1" />
                    <p className="text-ooolab_dark_1">
                        {' '}
                        {currentLesson?.title}
                    </p>
                </div>
                <div className="col-span-1 h-ooolab_top_sidebar flex items-center text-ooolab_lg py-ooolab_p_1 font-semibold  justify-end ">
                    {currentLesson?.status === 'pending' && (
                        <>
                            <button
                                className={` text-ooolab_sm  bg-ooolab_blue_1 rounded-lg p-ooolab_p_1 px-ooolab_p_3 focus:outline-none  text-white mr-ooolab_m_4 `}
                                onClick={onDecline}
                            >
                                Decline
                            </button>
                            <button
                                className={` text-ooolab_sm  bg-ooolab_blue_1 rounded-lg p-ooolab_p_1 px-ooolab_p_3 focus:outline-none  text-white  `}
                                onClick={onApprove}
                            >
                                Approve
                            </button>
                        </>
                    )}
                    <Link to={`/workspace/${params.id}/admin`}>
                        <div className="w-ooolab_w_8 h-ooolab_h_8 rounded-full  ml-ooolab_m_4 flex justify-center items-center group hover:shadow-ooolab_box_shadow_2 ">
                            <XIcon className="w-ooolab_w_5 h-ooolab_h_5 text-ooolab_dark_2 cursor-pointer focus:outline-none  group-hover:text-ooolab_blue_1" />
                        </div>
                    </Link>
                </div>
                <div
                    style={{
                        borderRadius: 20,
                    }}
                    className="col-span-2 w-full h-ooolab_below_top_sidebar shadow-ooolab_box_shadow_container px-ooolab_p_5 py-ooolab_p_5"
                >
                    <div className="h-3/6">
                        <div className="flex justify-between">
                            <p
                                id="lesson-name-input"
                                className="focus:outline-none disabled:bg-white disabled:cursor-not-allowed border-b border-white focus:border-ooolab_gray_2"
                            >
                                {currentLesson?.title}
                            </p>
                            <p className="capitalize flex items-center">
                                <span
                                    className={`w-ooolab_w_2_root h-ooolab_h_2 rounded-full mr-ooolab_m_2  ${
                                        statusShadow[
                                            currentLesson?.status || 'draft'
                                        ]
                                    }`}
                                />
                                <span className="text-ooolab_xs">
                                    {currentLesson?.status}
                                </span>
                            </p>
                        </div>
                        <div className="w-full mt-ooolab_m_4 ">
                            <div className="relative h-ooolab_h_8 border-ooolab_bar_color border rounded-lg mb-ooolab_m_4">
                                <div className="absolute top-0 left-0 flex items-center justify-center h-full  ">
                                    <label
                                        className="border-r text-ooolab_base px-ooolab_p_3 border-ooolab_bar_color"
                                        htmlFor="author"
                                    >
                                        Author
                                    </label>
                                    <div className="flex items-center">
                                        <img
                                            className="w-ooolab_w_5 h-ooolab_h_5 rounded-full mx-ooolab_m_2 "
                                            src={
                                                currentLesson?.created_by
                                                    .avatar_url || ''
                                            }
                                            alt=""
                                        />
                                        <p className="text-ooolab_dark_1">
                                            {currentLesson?.created_by
                                                .display_name || ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-ooolab_m_4">
                                <TagRender title="Courses" />
                            </div>
                            <TagRender
                                title={translator('TAGS')}
                                data={currentLesson?.tags}
                            />
                        </div>
                    </div>

                    <div className="w-full h-3/6 overflow-y-auto relative pb-ooolab_p_5 custom-scrollbar">
                        <div className="flex justify-between sticky top-0 bg-white left-0 w-full ">
                            <p>
                                <span>Sections</span>
                                <span className="ml-ooolab_m_3 bg-ooolab_light_blue_0 p-ooolab_p_2 rounded-full w-ooolab_w_6 h-ooolab_h_6 inline-flex justify-center items-center">
                                    {currentLesson?.sections?.length || 0}
                                </span>
                            </p>
                        </div>
                        <div className="py-ooolab_p_2">
                            {currentLesson?.sections?.map((i, index) => (
                                <div
                                    key={`section-${index}`}
                                    onClick={() =>
                                        dispatchLesson({
                                            type: LESSON_ACTIONS.SET_SECTION,
                                            value: {
                                                currentSection: {
                                                    description: i.description,
                                                    files: i.files?.map(
                                                        (j) => ({
                                                            ...j,
                                                            uid: '',
                                                        })
                                                    ),
                                                    title: i.title,
                                                },
                                                sectionIndex: index,
                                            },
                                        })
                                    }
                                    className={`${
                                        lesson.sectionIndex === index &&
                                        'bg-ooolab_bg_bar text-ooolab_blue_1'
                                    } cursor-pointer flex justify-between p-ooolab_p_5 border border-ooolab_bar_color rounded-lg my-ooolab_m_2`}
                                >
                                    <p>{i.title}</p>
                                    <span className="text-ooolab_dark_2">
                                        {i.files && i.files.length
                                            ? `${i.files.length} Files`
                                            : `${0} File`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-span-4 h-ooolab_below_top_sidebar px-ooolab_p_10 py-ooolab_p_5 shadow-ooolab_box_shadow_container rounded-3xl relative overflow-hidden ml-ooolab_m_6">
                    <SectionView section={lesson.currentSection} />
                </div>
            </div>
            <H5PModal
                isModal={isModal}
                setIsModal={setIsModal}
                modalProps={modalProps}
            />
        </div>
    );
};

export default AdminViewDetailLesson;
