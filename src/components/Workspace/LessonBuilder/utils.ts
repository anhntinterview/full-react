import { CreateCourseParam } from 'types/ApiData.type';
import {
    LessonInterface,
    LessonSection,
    TagType,
} from 'types/GetListOfWorkspace.type';
import { CreateLessonParam, SectionState } from 'types/Lesson.type';

export type LessonBuilderType = {
    status: 'init' | 'touched';
    currentSection: SectionState;
    sectionIndex: number;
    canEdit: boolean;
    canPublish: boolean;
    params: CreateLessonParam & {
        sections?: LessonSection[];
    };
    tags: TagType[];
    sections: SectionState[];
};

export const initialLesson = (type: string): LessonBuilderType => {
    return {
        params:
            type === 'new'
                ? {
                      title: 'Untitled',
                      skill_summary: ' ',
                  }
                : {},
        sectionIndex: -1,
        currentSection: {
            description: '',
            files: [],
            title: '',
        },
        status: 'init',
        canEdit: false,
        canPublish: false,
        tags: [],
        sections: [],
    };
};

export interface LessonFormInterface {
    data: {};
    status: 'init' | 'touched';
    currentSection: SectionState;
    sectionIndex: number;
    canEdit: boolean;
    canPublish: boolean;
}

export interface ActionType {
    type: string;
    value: any;
}

export const LESSON_ACTIONS = {
    RESET: 'RESET',
    SET_TITLE: 'SET_TITLE',
    SET_LESSON: 'SET_LESSON',
    SET_TAGS: 'SET_TAGS',
    ADD_TAGS: 'ADD_TAGS',
    REMOVE_TAGS: 'REMOVE_TAGS',
    SET_SECTION: 'SET_SECTION',
    EDIT_SECTIONS: 'EDIT_SECTIONS',
    MOVE_SECTIONS: 'MOVE_SECTIONS',
    DELETE_SECTIONS: 'DELETE_SECTIONS',
    ADD_SECTION: 'ADD_SECTION',
    CAN_EDIT: 'CAN_EDIT',
    CAN_PUBLISH: 'CAN_PUBLISH',
    CAN_APPROVE: 'CAN_APPROVE',
    SET_LESSONS_FROM_LESSON: 'SET_LESSONS_FROM_LESSON',
    SET_STATUS: 'SET_STATUS',
};

export const lessonReducer = (
    state: LessonBuilderType,
    action: ActionType
): LessonBuilderType => {
    const { type, value } = action;
    switch (type) {
        case LESSON_ACTIONS.SET_TITLE: {
            return {
                ...state,
                status: 'touched',
                params: {
                    ...state.params,
                    title: value,
                },
            };
        }
        case LESSON_ACTIONS.SET_TAGS:
            return {
                ...state,
                tags: value,
            };
        case LESSON_ACTIONS.ADD_TAGS: {
            return {
                ...state,
                tags: value,
                status: 'touched',
            };
        }
        case LESSON_ACTIONS.REMOVE_TAGS: {
            return {
                ...state,
                tags: value,
                status: 'touched',
            };
        }
        case LESSON_ACTIONS.SET_LESSON:
            return {
                ...state,
                params: value,
                canEdit: state.canEdit,
                canPublish: state.canPublish,
            };

        case LESSON_ACTIONS.SET_SECTION: {
            return {
                ...state,
                ...value,
            };
        }
        case LESSON_ACTIONS.ADD_SECTION:
            return {
                ...state,
                params: {
                    ...state.params,
                    sections: value,
                },
                sections: value,
                status: 'touched',
            };
        case LESSON_ACTIONS.EDIT_SECTIONS: {
            const copyState = { ...state };
            const currentSectionIndex = state.sectionIndex;
            const { sections } = copyState;
            if (sections[currentSectionIndex]) {
                sections[currentSectionIndex] = value;
            }
            copyState.params = { ...copyState.params, sections };

            return {
                ...copyState,
                status: 'touched',
            };
        }
        case LESSON_ACTIONS.MOVE_SECTIONS: {
            return {
                ...state,
                params: {
                    ...state.params,
                    sections: value,
                },
                sections: value,
                sectionIndex: -1,
                status: 'touched',
            };
        }
        case LESSON_ACTIONS.DELETE_SECTIONS: {
            const copyState = { ...state };
            const {
                params: { sections = [] },
                sections: sectionsRender,
            } = copyState;
            if (sectionsRender[value]) {
                if (value === 0) {
                    sectionsRender.shift();
                } else {
                    sectionsRender.splice(value, 1);
                }
                copyState.sectionIndex = -1;
                copyState.currentSection = {
                    description: '',
                    title: '',
                    files: [],
                };
            }
            return {
                ...copyState,
                params: {
                    ...copyState.params,
                    sections: sectionsRender,
                },
                status: 'touched',
            };
        }
        case LESSON_ACTIONS.CAN_EDIT: {
            return {
                ...state,
                canEdit: value,
            };
        }
        case LESSON_ACTIONS.CAN_PUBLISH: {
            return {
                ...state,
                canPublish: value,
            };
        }
        case LESSON_ACTIONS.SET_LESSONS_FROM_LESSON: {
            return {
                ...state,

                sections: value,
            };
        }
        case LESSON_ACTIONS.SET_STATUS: {
            return {
                ...state,
                status: 'init',
            };
        }
        case LESSON_ACTIONS.RESET: {
            return {
                ...state,
                params: {},
                status: 'init',
            };
        }
        default:
            return state;
    }
};
