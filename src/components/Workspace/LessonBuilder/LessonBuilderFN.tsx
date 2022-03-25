import workspaceMiddleware from 'middleware/workspace.middleware';
import {
    UpdateLessonBody,
    TagsInBodyType,
    CreateTagBody,
    GetMemberParams,
    ApprovalBody,
    AddTagCourseParam,
} from 'types/ApiData.type';
import { WorkspaceService } from 'services';
import React from 'react';
import { toast } from 'react-toastify';
import workspaceService from 'services/workspace.service';
import NotificationWithUndo from 'components/Notification/NotificationWIthUndo';

import DocumentCheck from 'assets/SVG/document-check.svg';
import { XIcon } from '@heroicons/react/outline';
import { CreateLessonParam, UpdateLessonParams } from 'types/Lesson.type';

export const updateLesson = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    lessonId: string,
    body: UpdateLessonParams,
    tags: { attachTags: AddTagCourseParam; detachTags: number[] }
) => {
    workspaceMiddleware.updateLessonDetail(
        dispatch,
        workspaceId,
        lessonId,
        body,
        tags
    );
};

export const addTag = async (
    workspaceId: string,
    lessonId: string,
    body: TagsInBodyType
) => {
    return WorkspaceService.attachTagsForLesson(
        workspaceId,
        lessonId,
        body
    ).then((res) => {
        return res;
    });
};

export const removeTag = async (
    workspaceId: string,
    lessonId: string,
    tagId: number
) => {
    return WorkspaceService.detachTagsForLesson(workspaceId, lessonId, tagId);
};

export const addSection = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    lessonId: string,
    body: UpdateLessonBody
) => {
    // WorkspaceService.updateLessonDetail(workspaceId, lessonId, body);
    // workspaceMiddleware.updateLessonDetail(
    //     dispatch,
    //     workspaceId,
    //     lessonId,
    //     body
    // );
};

export const createTag = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    body: CreateTagBody
) => {
    WorkspaceService.createlessonTags(workspaceId, body)
        .then((res) => {
            if (res && res.id) {
                setTimeout(
                    () =>
                        workspaceMiddleware.getLessonTags(
                            dispatch,
                            workspaceId
                        ),
                    1000
                );
                return true;
            }
            return false;
        })
        .catch((err) => {
            toast.error('Duplicate tag!', {
                position: 'bottom-left',
            });
        });
};

export const getMemberList = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    params?: GetMemberParams
) => {
    workspaceMiddleware.getWorkspaceMembers(
        dispatch,
        {
            id: workspaceId,
        },
        params
    );
};

export const createApproval = (
    translator: Function,
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    lessonId: string,
    body: ApprovalBody
) => {
    const onCancel = () => cancelApproval(dispatch, workspaceId, lessonId);
    workspaceService
        .createLessonApproval(workspaceId, lessonId, body)
        .then((res) => {
            if (res) {
                setTimeout(() => {
                    workspaceMiddleware.getLessonDetail(
                        dispatch,
                        workspaceId,
                        lessonId
                    );
                }, 1000);
            }
            toast(
                <NotificationWithUndo
                    onClickCancel={() => onCancel()}
                    imageContent={DocumentCheck}
                    type="warning"
                    textContent={translator('SENT_TO_ADMIN')}
                />,
                {
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeButton: false,
                    bodyStyle: {
                        padding: 0,
                    },
                    delay: 500,
                    position: 'bottom-left',
                    className: 'shadow-ooolab_box_shadow_2 min-w-ooolab_w_100',
                }
            );
        })
        .catch((err) => toast.error(err));
};

export const cancelApproval = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    lessonId: string
): Promise<boolean> => {
    return workspaceService
        .cancelLessonApproval(workspaceId, lessonId)
        .then((res) => res)
        .catch((err: Error) => {
            toast.error(
                <NotificationWithUndo
                    textContent={err.message}
                    imageContent={<XIcon className="text-white" />}
                    type="danger"
                />,
                {
                    autoClose: false,
                    hideProgressBar: true,
                    closeButton: false,
                    bodyStyle: {
                        padding: 0,
                    },
                    delay: 500,
                    position: 'bottom-left',
                    className: 'shadow-ooolab_box_shadow_2 min-w-ooolab_w_100',
                }
            );
            return false;
        })
        .finally(() => {
            setTimeout(() => {
                workspaceMiddleware.getLessonDetail(
                    dispatch,
                    workspaceId,
                    lessonId
                );
            }, 1000);
        });
};

export const approveLessonRequest = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    lessonId: string
) => {
    workspaceService
        .approveLessonApproval(workspaceId, lessonId)
        .catch((err: Error) => {
            toast.error(
                <NotificationWithUndo
                    textContent={err.message}
                    imageContent={<XIcon className="text-white" />}
                    type="danger"
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
                    className: 'shadow-ooolab_box_shadow_2 min-w-ooolab_w_100',
                }
            );
        })
        .finally(() => {
            setTimeout(() => {
                workspaceMiddleware.getLessonDetail(
                    dispatch,
                    workspaceId,
                    lessonId
                );
            }, 1000);
        });
};

export const createNewLesson = async ({
    workspaceId,
    body,
    successCallback,
    errorCallback,
}: {
    workspaceId: string;
    body: CreateLessonParam;
    successCallback?: Function;
    errorCallback?: (e: string) => void;
}) => {
    workspaceService
        .createLesson(workspaceId, body)
        .then((res) => {
            if (res && successCallback) {
                successCallback();
            }
        })
        .catch((err) => {
            if (errorCallback) {
                errorCallback(err);
            }
        });
};

export const handleRemoveLesson = async (
    workspaceId: string,
    lessonId: string,
    successCB: Function,
    errorCB: Function
) => {
    workspaceService
        .removeLesson(workspaceId, lessonId)
        .then((res) => {
            if (res) {
                successCB();
            }
        })
        .catch(() => errorCB());
};
