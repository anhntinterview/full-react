import React, {
    useEffect,
    useContext,
    useReducer,
    useState,
    useCallback,
} from 'react';
import { Prompt, useParams, useHistory, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import {
    EyeIcon,
    PencilAltIcon,
    PlusIcon,
    TrashIcon,
    XIcon,
} from '@heroicons/react/outline';
import lodash, { debounce } from 'lodash';

import SectionH5P from '../Lesson/components/SectionH5P';
import TagRender from '../../TagRender';
import PublishLesson from './component/PublishLesson';
import Modal from 'components/Modal';
import SaveChanges from 'assets/SVG/save-changes.svg';
import CancelChanges from 'assets/SVG/cancel.svg';

import { CreateTagBody } from '../../../types/ApiData.type';
import { SectionState } from '../../../types/Lesson.type';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';

import { handleGetLessonTags, handleRecoverLesson } from '../Lesson/LessonFN';
import {
    updateLesson,
    createTag,
    createNewLesson,
    handleRemoveLesson,
} from './LessonBuilderFN';

import {
    ActionType,
    initialLesson,
    LessonBuilderType,
    lessonReducer,
    LESSON_ACTIONS,
} from './utils';
import './style.css';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import ModalRename from '../CourseDetail/component/ModalRename';
import { ACTIONS } from '../CourseDetail/reducers';
import ActionsCircleButton from 'components/ActionsCircleButton';
import RenderLessonH5P from './component/RenderLessonH5P';
import { useTranslation } from 'react-i18next';
import NotificationWithUndo from 'components/Notification/NotificationWIthUndo';
import { useBoolean } from 'hooks/custom';
import { StatusContent } from 'constant/util.const';

const statusShadow: Record<any, string> = {
    draft: 'shadow-ooolab_lesson_status bg-ooolab_dark_50 ',
    pending: 'shadow-ooolab_lesson_status_pending bg-ooolab_warning',
    public: 'shadow-ooolab_alert_success bg-ooolab_alert_success',
};

const LessonBuilder: React.FC = ({ children }) => {
    const userInfo = getLocalStorageAuthData();
    const params: { id: string; lessonId: string } = useParams();
    const history = useHistory();
    const { dispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );

    const {
        currentLesson,
        tagList,
        isUpdatingLesson,
        updateStatus,
        tagResult,
        result: workspaceDetail,
    } = getWorkspaceDetailState;
    const [lesson, dispatchLesson] = useReducer<
        React.Reducer<LessonBuilderType, ActionType>
    >(lessonReducer, initialLesson(params.lessonId));
    const {
        booleanValue: isCreating,
        toggleBooleanValue: toggleIsCreating,
    } = useBoolean();
    const [modalSuccess, setModalSuccess] = useState(false);
    const [modalError, setModalError] = useState(false);
    const [modalRename, setModalRename] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);
    const [modalCreateError, setModalCreateError] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [prevAdmin, setPrevAdmin] = useState(false);

    const { t: translator } = useTranslation();

    const handleAddTags = (e: number) => {
        const item = tagList.items.find((i) => i.id === e);
        const tmp = [...(lesson.tags || []), item];
        dispatchLesson({
            type: ACTIONS.ADD_TAGS,
            value: tmp,
        });
    };

    const handleRemoveTag = (e: number) => {
        const targetIndex = lesson?.tags.findIndex((i) => i.id === e);
        if (targetIndex !== -1) {
            const tmp = [...lesson.tags];
            tmp.splice(targetIndex, 1);
            dispatchLesson({
                type: ACTIONS.REMOVE_TAGS,
                value: tmp,
            });
        }
    };

    const handleEditSection = (sec: SectionState) => {
        dispatchLesson({
            type: LESSON_ACTIONS.EDIT_SECTIONS,
            value: sec,
        });
    };

    const handleCreateNewLesson = useCallback(() => {
        toggleIsCreating();
        const tmpBody = { ...lesson.params };
        if (lesson.tags.length) {
            tmpBody.tags = lesson.tags.map((i) => ({ tag_id: i.id }));
        }
        createNewLesson({
            workspaceId: params.id,
            body: tmpBody,
            successCallback: () => {
                toggleIsCreating();
                setModalCreate(true);
                setTimeout(
                    () => history.push(`/workspace/${params.id}/lesson`),
                    2000
                );
            },
            errorCallback: () => {
                setModalCreateError(true);
                toggleIsCreating();
            },
        });
    }, [lesson]);

    const handleEditLesson = useCallback(() => {
        let deletedTags: number[] = [];
        let addedTags: number[] = [];

        //tags received from api
        const originListTags = currentLesson?.tags?.length
            ? currentLesson.tags.map((i) => i.id)
            : [];
        //tags user interacted before submitting
        const modifiedListTags = lesson?.tags?.map((i) => i.id) || [];
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
        updateLesson(
            dispatch,
            params.id,
            params.lessonId,
            {
                ...lesson.params,
            },
            {
                attachTags: {
                    tags: addedTags.map((i) => ({ tag_id: i })),
                },
                detachTags: deletedTags,
            }
        );
    }, [lesson]);

    const handleAddSection = () => {
        const tmp = { ...lesson };
        const { sections } = tmp;
        const newSections = {
            title: `Untitled`,
            files: [],
            description: ' ',
        };
        if (sections) {
            sections.push(newSections);
        } else {
            const newArr = [];
            newArr.push(newSections);
            tmp.sections = newArr;
        }
        dispatchLesson({
            type: LESSON_ACTIONS.ADD_SECTION,
            value: sections,
        });
    };

    const handleDeleteSection = useCallback(() => {
        dispatchLesson({
            type: LESSON_ACTIONS.DELETE_SECTIONS,
            value: lesson.sectionIndex,
        });
    }, [lesson.sectionIndex]);

    const handleMoveSections = useCallback(
        (dragIdx: number, hoverIdx: number) => {
            const tmpSelected = [...lesson.sections];
            const draggedLesson = lesson.sections[dragIdx];
            let tmp;
            if (dragIdx < hoverIdx) {
                tmp = [
                    ...tmpSelected.slice(0, dragIdx),
                    ...tmpSelected.slice(dragIdx + 1, hoverIdx + 1),
                    draggedLesson,
                    ...tmpSelected.slice(hoverIdx + 1),
                ];
            } else {
                tmp = [
                    ...tmpSelected.slice(0, hoverIdx),
                    draggedLesson,
                    ...tmpSelected.slice(hoverIdx, dragIdx),
                    ...tmpSelected.slice(dragIdx + 1),
                ];
            }
            dispatchLesson({
                type: LESSON_ACTIONS.MOVE_SECTIONS,
                value: tmp,
            });
        },
        [lesson.sections]
    );

    const handleClickLessonH5P = (e: SectionState, idx: number) => {
        dispatchLesson({
            type: LESSON_ACTIONS.SET_SECTION,
            value: {
                currentSection: {
                    description: e.description,
                    files: e.files?.map((j) => ({
                        ...j,
                        uid: '',
                    })),
                    title: e.title,
                },
                sectionIndex: idx,
            },
        });
    };

    const debounceInput = useCallback(
        debounce((nextValue: string, asyncFunction: (e: string) => void) => {
            asyncFunction(nextValue);
        }, 1000),
        []
    );

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
        if (params.lessonId === 'new') {
            dispatchLesson({
                type: LESSON_ACTIONS.CAN_EDIT,
                value: true,
            });
        } else {
            workspaceMiddleware.getLessonDetail(
                dispatch,
                params.id,
                params.lessonId
            );
        }
        // if (workspaceDetail.id === -1) {
        //     workspaceMiddleware.getWorkspace(dispatch, {
        //         id: params.id,
        //     });
        // }
        handleGetLessonTags(dispatch, params.id);
        return () => {
            workspaceMiddleware.setCurrentRouteDetail(dispatch, []);
            setModalSuccess(false);
        };
    }, []);

    useEffect(() => {
        if (currentLesson) {
            dispatchLesson({
                type: LESSON_ACTIONS.SET_LESSONS_FROM_LESSON,
                value: currentLesson.sections || [],
            });
            dispatchLesson({
                type: LESSON_ACTIONS.SET_TAGS,
                value: currentLesson.tags,
            });
            if (workspaceDetail.id !== -1) {
                const {
                    membership: { user_id: currentUserId, role },
                } = workspaceDetail;
                dispatchLesson({
                    type: LESSON_ACTIONS.CAN_EDIT,
                    value:
                        currentLesson.status === 'draft' &&
                        (currentLesson.created_by.id === currentUserId ||
                            role.toLocaleLowerCase() === 'admin'),
                });
            }
            workspaceMiddleware.setCurrentRouteDetail(dispatch, [
                { name: currentLesson.title, routeId: 'lessonId' },
            ]);
        } else {
            workspaceMiddleware.setCurrentRouteDetail(dispatch, [
                { name: 'New', routeId: 'lessonId' },
            ]);
        }
    }, [currentLesson]);

    useEffect(() => {
        if (updateStatus === 'done') {
            workspaceMiddleware.getLessonDetail(
                dispatch,
                params.id,
                params.lessonId
            );
            dispatchLesson({
                type: LESSON_ACTIONS.RESET,
                value: 'init',
            });
            setModalSuccess(true);
        } else if (updateStatus === 'error') {
            setModalError(true);
        }
    }, [updateStatus, tagResult]);

    useEffect(() => {
        if (workspaceDetail.id !== -1 && params.lessonId !== 'new') {
            console.log(workspaceDetail);
            const {
                membership: { user_id: currentUserId, role },
            } = workspaceDetail;
            dispatchLesson({
                type: LESSON_ACTIONS.CAN_EDIT,
                value:
                    currentLesson?.status === 'draft' &&
                    (currentLesson?.created_by.id === currentUserId ||
                        role.toLocaleLowerCase() === 'admin'),
            });
            dispatchLesson({
                type: LESSON_ACTIONS.CAN_PUBLISH,
                value: role.toLocaleLowerCase() === 'admin',
            });
        }
    }, [workspaceDetail]);

    return (
        <div className="px-ooolab_p_16 w-full h-screen relative">
            <XIcon
                onClick={() => {
                    prevAdmin
                        ? history.push(`/workspace/${params.id}/admin`)
                        : history.push(`/workspace/${params.id}/lesson`);
                }}
                className="w-ooolab_w_5 h-ooolab_h_5 absolute top-2 right-6 text-ooolab_dark_2 cursor-pointer"
            />
            <ModalRename
                title={lesson.params.title || currentLesson?.title || ''}
                isOpen={modalRename}
                onClose={() => setModalRename(false)}
                onConfirm={(e) => {
                    dispatchLesson({
                        type: ACTIONS.SET_TITLE,
                        value: e,
                    });
                }}
            />
            <Modal
                isOpen={modalSuccess}
                onClose={() => setModalSuccess(false)}
                title={translator('MODALS.SUCCESS.SAVED_LESSON')}
                imgSrc={SaveChanges}
            />
            <Modal
                isOpen={modalError}
                onClose={() => setModalError(false)}
                title={translator('MODALS.ERRORS.SAVING_FAIL')}
                imgSrc={CancelChanges}
            />
            {/* lesson creates successfully */}
            <Modal
                isOpen={modalCreate}
                onClose={() => history.push(`/workspace/${params.id}/lesson`)}
                closable={false}
                title={
                    <div className="mb-ooolab_m_1">
                        <p>{translator('MODALS.SUCCESS.LESSON_CREATE')}</p>
                        <p className="text-ooolab_dark_2 text-ooolab_xs mt-ooolab_m_2">
                            {translator(
                                'MODALS.SUCCESS.LESSON_REDIRECT_TO_LIST'
                            )}
                        </p>
                    </div>
                }
                imgSrc={SaveChanges}
            />

            {/* Create lesson fail */}
            <Modal
                isOpen={modalCreateError}
                onClose={() => setModalCreateError(false)}
                closable={false}
                title={translator('MODALS.ERRORS.LESSON_CREATE')}
                imgSrc={CancelChanges}
                mainBtn={
                    <button
                        onClick={() => setModalCreateError(false)}
                        className="focus:outline-none text-ooolab_sm bg-red-500 text-white shadow-ooolab_login_1 px-ooolab_p_3 py-ooolab_p_1_e rounded-lg"
                    >
                        {translator('MODALS.CLOSE')}
                    </button>
                }
            />
            <Modal
                isOpen={modalDelete}
                onClose={() => setModalDelete(false)}
                closable
                title={translator('MODALS.CONFIRM_DELETE_MODAL.TITLE_TEXT')}
                imgSrc={CancelChanges}
                mainBtn={
                    <button
                        onClick={() =>
                            handleRemoveLesson(
                                params.id,
                                params.lessonId,
                                () => {
                                    setTimeout(() => {
                                        history.push(
                                            `/workspace/${params.id}/lesson`
                                        );
                                        toast(
                                            <NotificationWithUndo
                                                onClickCancel={() =>
                                                    handleRecoverLesson(
                                                        dispatch,
                                                        params.id,
                                                        params.lessonId
                                                    )
                                                }
                                                imageContent={
                                                    <TrashIcon className="bg-ooolab_blue_1 text-white" />
                                                }
                                                textContent={translator(
                                                    'MODALS.SUCCESS.REMOVE_LESSON'
                                                )}
                                                type="success"
                                            />,
                                            {
                                                closeOnClick: false,
                                                autoClose: 5000,
                                                hideProgressBar: true,
                                                closeButton: false,
                                                bodyStyle: {
                                                    padding: 0,
                                                },
                                                delay: 500,
                                                position: 'bottom-left',
                                                className:
                                                    'shadow-ooolab_box_shadow_2 min-w-ooolab_w_80',
                                            }
                                        );
                                    }, 1000);
                                },
                                () => {}
                            )
                        }
                        className="focus:outline-none text-ooolab_sm bg-red-500 text-white shadow-ooolab_login_1 px-ooolab_p_3 py-ooolab_p_1_e rounded-lg"
                    >
                        {translator('MODALS.CONFIRM_DELETE_MODAL.YES_DO_IT')}
                    </button>
                }
                subBtn={
                    <button
                        onClick={() => setModalDelete(false)}
                        className="focus:outline-none text-ooolab_sm text-black shadow-ooolab_login_1 px-ooolab_p_3 py-ooolab_p_1_e rounded-lg"
                    >
                        {translator('MODALS.CONFIRM_DELETE_MODAL.NO_CANCEL')}
                    </button>
                }
            />

            <Prompt
                when={lesson.status === 'touched' && !modalCreate}
                message={() => {
                    return `${translator('MODALS.UNSAVED_PROMPT')}`;
                }}
            ></Prompt>
            <ToastContainer />
            <div className="grid auto-rows-max grid-cols-6 gap-x-8 h-full pb-ooolab_p_2">
                {/* Search bar */}
                <div className="col-span-4 h-ooolab_top_sidebar flex items-center text-ooolab_lg py-ooolab_p_1 font-semibold">
                    <div className="w-1/8">{children}</div>
                    {/* <p className="text-ooolab_dark_1 font-semibold text-ooolab_xl">
                        {translator('LESSON.TITLE')}
                    </p> */}
                </div>
                <div className="col-span-2 h-ooolab_top_sidebar flex justify-end items-center ">
                    {!isUpdatingLesson &&
                    updateStatus === 'done' &&
                    lesson.status === 'init' ? (
                        <p className="text-ooolab_dark_2 text-ooolab_xs mr-ooolab_m_2">
                            {translator('LESSON.ALL_CHANGES_SAVED')}
                        </p>
                    ) : null}
                    {lesson.canEdit && params.lessonId !== 'new' && (
                        <button
                            onClick={() => handleEditLesson()}
                            disabled={lesson.status !== 'touched'}
                            className={`${
                                lesson.status !== 'touched'
                                    ? 'bg-ooolab_dark_50 text-white cursor-not-allowed'
                                    : 'bg-ooolab_blue_1 text-white'
                            } text-ooolab_sm shadow-ooolab_login_1 px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none flex mr-ooolab_m_2`}
                        >
                            {translator('LESSON.SAVE')}
                        </button>
                    )}
                    {params.lessonId === 'new' && (
                        <button
                            onClick={() => handleCreateNewLesson()}
                            disabled={lesson.status !== 'touched' || isCreating}
                            className={`${
                                lesson.status !== 'touched'
                                    ? 'bg-ooolab_dark_50 text-white cursor-not-allowed'
                                    : 'bg-ooolab_blue_1 text-white'
                            } text-ooolab_sm shadow-ooolab_login_1 px-ooolab_p_3 py-ooolab_p_1_e rounded-lg focus:outline-none flex mr-ooolab_m_2`}
                        >
                            {translator('LESSON.CREATE')}
                        </button>
                    )}
                    <PublishLesson
                        status={currentLesson?.status}
                        canPublish={lesson.canPublish}
                    />
                </div>
                <div
                    style={{
                        borderRadius: 20,
                    }}
                    className="col-span-2 w-full h-ooolab_below_top_sidebar shadow-ooolab_box_shadow_container px-ooolab_p_5 py-ooolab_p_5"
                >
                    <div className="h-3/6">
                        <div className="flex justify-between">
                            {/* <input
                                id="lesson-name-input"
                                className="focus:outline-none disabled:bg-white disabled:cursor-not-allowed border-b border-white focus:border-ooolab_gray_2"
                                onChange={(e) => {
                                    debounceInput(e.target.value, (p: string) =>
                                        dispatchLesson({
                                            type: LESSON_ACTIONS.SET_TITLE,
                                            value: p,
                                        })
                                    );
                                }}
                            /> */}
                            <span>
                                {lesson.params.title || currentLesson?.title}
                            </span>
                            <p className="capitalize flex items-center">
                                <span
                                    className={`w-ooolab_w_2_root h-ooolab_h_2 rounded-full mr-ooolab_m_2  ${
                                        statusShadow[
                                            currentLesson?.status || 'draft'
                                        ]
                                    }`}
                                />
                                <span>
                                    {StatusContent(
                                        translator,
                                        currentLesson?.status
                                    )}
                                </span>
                            </p>
                        </div>
                        <div className="text-ooolab_dark_2">
                            {params.lessonId !== 'new' ? (
                                <ActionsCircleButton
                                    onclick={() =>
                                        history.push(
                                            `/workspace/${params.id}/lesson/${params.lessonId}/preview`
                                        )
                                    }
                                    icon={
                                        <EyeIcon className="w-ooolab_w_4 h-ooolab_h_4" />
                                    }
                                />
                            ) : null}
                            {(params.lessonId === 'new' ||
                                currentLesson?.status === 'draft') && (
                                <ActionsCircleButton
                                    icon={
                                        <PencilAltIcon
                                            onClick={() => setModalRename(true)}
                                            className="w-ooolab_w_4 h-ooolab_h_4"
                                        />
                                    }
                                />
                            )}
                            {((currentLesson?.status !== 'public' &&
                                currentLesson?.created_by.id ===
                                    workspaceDetail.membership.user_id) ||
                                workspaceDetail.membership.role === 'admin') &&
                            params.lessonId !== 'new' ? (
                                <ActionsCircleButton
                                    onclick={() => setModalDelete(true)}
                                    icon={
                                        <TrashIcon className="w-ooolab_w_4 h-ooolab_h_4" />
                                    }
                                />
                            ) : null}
                        </div>
                        <div className="w-full mt-ooolab_m_4 ">
                            <div className="relative h-ooolab_h_8 border-ooolab_bar_color border rounded-lg mb-ooolab_m_4">
                                <div className="absolute top-0 left-0 flex items-center justify-center h-full  ">
                                    <label
                                        className="border-r text-ooolab_base px-ooolab_p_3 border-ooolab_bar_color"
                                        htmlFor="author"
                                    >
                                        {translator('LESSON.AUTHOR')}
                                    </label>
                                    <div className="flex items-center">
                                        <img
                                            className="w-ooolab_w_5 h-ooolab_h_5 rounded-full mx-ooolab_m_2 "
                                            src={
                                                params.lessonId === 'new'
                                                    ? userInfo.avatar_url
                                                    : currentLesson?.created_by
                                                          .avatar_url
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
                            {/* <div className="mb-ooolab_m_4">
                                <TagRender title="Courses" />
                            </div> */}
                            <TagRender
                                title={translator('TAGS')}
                                data={lesson.tags || currentLesson?.tags}
                                isEditable={
                                    currentLesson?.status === 'draft' ||
                                    params.lessonId === 'new'
                                }
                                onCheck={handleAddTags}
                                onUnCheck={handleRemoveTag}
                                // onCreate={handleCreateTag}
                            />
                        </div>
                    </div>

                    <div className="w-full h-3/6 overflow-y-auto relative pb-ooolab_p_5 custom-scrollbar">
                        <div className="flex justify-between sticky top-0 bg-white left-0 w-full ">
                            <p>
                                <span>{translator('LESSON.SECTIONS')}</span>
                                <span className="ml-ooolab_m_3 bg-ooolab_light_blue_0 p-ooolab_p_2 rounded-full w-ooolab_w_6 h-ooolab_h_6 inline-flex justify-center items-center">
                                    {lesson.sections?.length || 0}
                                </span>
                            </p>
                            {lesson.canEdit && (
                                <div
                                    onClick={() => handleAddSection()}
                                    className="flex justify-center items-center focus:outline-none w-ooolab_w_8 h-ooolab_h_6 rounded-md border cursor-pointer"
                                >
                                    <PlusIcon className="w-ooolab_w_4 h-ooolab_h_4" />
                                </div>
                            )}
                        </div>
                        <div className="py-ooolab_p_2">
                            {lesson.sections?.map((i, index) => (
                                <RenderLessonH5P
                                    data={i}
                                    index={index}
                                    currentSectionIndex={lesson.sectionIndex}
                                    onClickLessonH5p={handleClickLessonH5P}
                                    moveCard={handleMoveSections}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="col-span-4 h-ooolab_below_top_sidebar px-ooolab_p_10 py-ooolab_p_5 shadow-ooolab_box_shadow_container rounded-3xl relative overflow-hidden">
                    <SectionH5P
                        onEdit={handleEditSection}
                        onDelete={handleDeleteSection}
                        section={lesson.currentSection}
                        isActive={lesson.sectionIndex !== -1}
                        isEditable={lesson.canEdit}
                    />
                </div>
            </div>
        </div>
    );
};

export default LessonBuilder;
