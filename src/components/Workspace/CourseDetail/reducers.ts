import { UpdateCourseParam } from 'types/ApiData.type';
import { LessonInterface, TagType } from 'types/GetListOfWorkspace.type';

export const ACTIONS = {
    RESET: 'RESET',
    SET_TITLE: 'SET_TITLE',
    SET_LESSONS: 'SET_LESSONS',
    SET_THUMBNAIL: 'SET_THUMBNAIL',
    ADD_LESSONS: 'ADD_LESSONS',
    SET_TAGS: 'SET_TAGS',
    ADD_TAGS: 'ADD_TAGS',
    REMOVE_TAGS: 'REMOVE_TAGS',
    SET_DESCRIPTION: 'SET_DESCRIPTION',
    SET_STATUS: 'SET_STATUS',
    CAN_EDIT: 'CAN_EDIT',
    CAN_PUBLISH: 'CAN_PUBLISH',
};

export type CourseReducerType = {
    params: UpdateCourseParam;
    tags: TagType[];
    courseBackgroundImage:
        | {
              file: File;
              canvas: HTMLCanvasElement;
              result: string;
          }
        | undefined;
    status: 'init' | 'touched';
    lesson: LessonInterface[];
    canEdit: boolean;
    canPublish: boolean;
};

export type ActionType = {
    type: string;
    value: any;
};

export const initValue = (params: string): CourseReducerType => {
    return {
        params:
            params === 'new'
                ? {
                      full_description: 'full description',
                      short_description: ' ',
                      type: 'online',
                      title: 'untitled',
                  }
                : {},
        tags: [],
        courseBackgroundImage: undefined,
        status: 'init',
        canEdit: false,
        canPublish: false,
        lesson: [],
    };
};

export const courseReducer = (
    state: CourseReducerType,
    dispatch: ActionType
): CourseReducerType => {
    const { type, value } = dispatch;
    switch (type) {
        case ACTIONS.SET_TITLE:
            return {
                ...state,
                params: {
                    ...state.params,
                    title: value,
                },
                status: 'touched',
            };
        case ACTIONS.SET_LESSONS: {
            return {
                ...state,
                lesson: value,
            };
        }
        case ACTIONS.ADD_LESSONS:
            return {
                ...state,
                params: {
                    ...state.params,
                    lessons: value,
                },
                status: 'touched',
            };
        case ACTIONS.SET_STATUS:
            return {
                ...state,
                status: 'init',
            };
        case ACTIONS.SET_DESCRIPTION: {
            return {
                ...state,
                params: {
                    ...state.params,
                    full_description: value,
                },
                status: 'touched',
            };
        }
        case ACTIONS.ADD_TAGS: {
            return {
                ...state,
                tags: value,
                status: 'touched',
            };
        }
        case ACTIONS.SET_TAGS: {
            return {
                ...state,
                tags: value,
            };
        }
        case ACTIONS.REMOVE_TAGS: {
            return {
                ...state,
                tags: value,
                status: 'touched',
            };
        }
        case ACTIONS.CAN_EDIT: {
            return {
                ...state,
                canEdit: value,
            };
        }
        case ACTIONS.CAN_PUBLISH: {
            return {
                ...state,
                canPublish: value,
            };
        }
        case ACTIONS.SET_THUMBNAIL: {
            return {
                ...state,
                courseBackgroundImage: value,
                status: 'touched',
            };
        }
        case ACTIONS.RESET: {
            return {
                ...state,
                params: {},
                status: 'init',
            };
        }
        default:
            break;
    }

    return state;
};
