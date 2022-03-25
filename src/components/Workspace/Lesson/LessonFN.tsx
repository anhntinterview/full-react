import dayjs from 'dayjs';
import RelativeTime from 'dayjs/plugin/relativeTime';
import UTC from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { Lesson, LessonInterface } from 'types/GetListOfWorkspace.type';
import {
    getLessonFilterLocal,
    getLocalStorageAuthData,
} from 'utils/handleLocalStorage';
import React from 'react';
import { ListParam } from 'types/ApiData.type';
import workspaceMiddleware from 'middleware/workspace.middleware';
import workspaceService from 'services/workspace.service';
import { ParamInterface } from './Lesson';
import { toast } from 'react-toastify';
import NotificationWithUndo from 'components/Notification/NotificationWIthUndo';
import { TrashIcon } from '@heroicons/react/outline';
import { LESSON_ACTIONS } from './actions';

dayjs.extend(RelativeTime);
dayjs.extend(UTC);
dayjs.extend(timezone);

export const generateData = (d: Lesson) => {
    const { items } = d;
    if (items && items.length) {
        return items.map((i) => {
            const temp = { ...i };
            temp.updated_on = dayjs
                .utc(i.updated_on)
                .tz()
                .locale('en-gb')
                .fromNow();
            return temp;
        });
    }

    return [];
};

export const handleGetLessonsList = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    params?: ListParam
) => {
    workspaceMiddleware.getLessonList(dispatch, workspaceId, params);
};

export const handleClickRow = (
    dispatch: React.Dispatch<any>,
    e: LessonInterface,
    workspaceId: string
) => {
    workspaceMiddleware.setCurrentLesson(dispatch, e);
    workspaceMiddleware.getLessonDetail(dispatch, `${workspaceId}`, `${e.id}`);
};

export const handleGetLessonTags = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    e?: string
) => {
    workspaceMiddleware.getLessonTags(dispatch, workspaceId, e);
};

export const handleCreateNewLesson = async (workspaceId: string) => {
    return workspaceService.createLesson(workspaceId, {
        title: 'test',
        skill_summary: ' ',
    });
};

export const generateDefaultParam = (): ParamInterface => {
    const local = getLessonFilterLocal();
    return {
        param: {
            title: '',
            order: 'desc',
            page: 1,
            per_page: 10,
            sort_by: 'updated_on',
            tag_id: local.tags.length
                ? local.tags.map((i) => i.id).join(',')
                : '',
            created_by: local.authors.length
                ? local.authors.map((i) => i.id).join(',')
                : '',
        },
        hasNextPage: false,
        selectedTag: local.tags,
        selectedAuthor: local.authors,
    };
};

export const handleRemoveLesson = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    lessonId: string
) => {
    workspaceService.removeLesson(workspaceId, lessonId).then((res) => {
        if (res) {
            setTimeout(() => {
                workspaceMiddleware.getLessonList(dispatch, workspaceId);
                toast(
                    <NotificationWithUndo
                        onClickCancel={() =>
                            handleRecoverLesson(dispatch, workspaceId, lessonId)
                        }
                        imageContent={
                            <TrashIcon className="bg-ooolab_blue_1 text-white" />
                        }
                        textContent="Lesson was moved to Trash"
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
        }
    });
};

interface ActionType {
    type: string;
    value: any;
}

export const handleRecoverLesson = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    lessonId: string
): Promise<boolean> => {
    return workspaceService
        .recoverLesson(workspaceId, lessonId)
        .then((res) => {
            if (res) {
                setTimeout(
                    () =>
                        workspaceMiddleware.getLessonList(
                            dispatch,
                            workspaceId
                        ),
                    1000
                );
            }
            return true;
        })
        .catch(() => false);
};

export const lessonParamReducer = (
    state: ParamInterface,
    action: ActionType
): ParamInterface => {
    const { type, value } = action;
    switch (type) {
        case LESSON_ACTIONS.SET_TITLE: {
            return {
                ...state,
                param: {
                    ...state.param,
                    title: value,
                },
            };
        }
        case LESSON_ACTIONS.SET_SELECTED_TAG: {
            return {
                ...state,
                selectedTag: value,
            };
        }
        case LESSON_ACTIONS.SET_SELECTED_AUTHOR: {
            return {
                ...state,
                selectedAuthor: value,
            };
        }
        case LESSON_ACTIONS.SET_FILTER_MENU: {
            return {
                ...state,
                param: {
                    ...state.param,
                    ...value,
                },
            };
        }
        case LESSON_ACTIONS.SET_ORDER: {
            return {
                ...state,
                param: {
                    ...state.param,
                    order: value,
                },
            };
        }
        case LESSON_ACTIONS.SET_PAGE: {
            return {
                ...state,
                param: {
                    ...state.param,
                    page: value,
                },
            };
        }
        default: {
            throw new Error(`Unsupported action type: ${type}`);
        }
    }
};
