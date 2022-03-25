import { CourseParam } from 'types/ApiData.type';
import { CheckboxType } from 'types/Lesson.type';

export const COURSE_ACTIONS = {
    SET_TITLE: 'SET_TITLE',
    SET_PAGE: 'SET_PAGE',
    SET_ORDER: 'SET_ORDER',
    SET_AUTHORS: 'SET_AUTHORS',
    SET_TAGS: 'SET_TAGS',
    SET_TAGS_AND_AUTHORS: 'SET_TAGS_AND_AUTHORS',
    SET_PARAMS_TRASH: 'SET_PARAMS_TRASH',
    SET_CREATED_BY: 'SET_CREATED_BY',
};

export type CourseParamsType = CourseParam & {
    selectedTags?: CheckboxType[];
    selectedAuthors?: CheckboxType[];
};

export type Actions = {
    type: string;
    value: any;
};

export const courseReducer = (
    state: CourseParamsType,
    actions: Actions
): CourseParamsType => {
    const { type, value } = actions;

    switch (type) {
        case COURSE_ACTIONS.SET_TITLE: {
            return {
                ...state,
                title: value,
            };
        }
        case COURSE_ACTIONS.SET_PAGE: {
            return {
                ...state,
                page: value,
            };
        }
        case COURSE_ACTIONS.SET_ORDER: {
            return {
                ...state,
                order: value,
            };
        }
        case COURSE_ACTIONS.SET_AUTHORS: {
            return {
                ...state,
                created_by: value.map((i: any) => i.id).join(','),
                selectedAuthors: value,
            };
        }
        case COURSE_ACTIONS.SET_TAGS: {
            return {
                ...state,
                tag_id: value.map((i: any) => i.id).join(','),
                selectedTags: value,
            };
        }
        case COURSE_ACTIONS.SET_TAGS_AND_AUTHORS: {
            console.log(value.authors)
            return {
                ...state,
                created_by: value.authors.map((i: any) => i.id).join(','),
                selectedAuthors: value.authors,
                tag_id: value.tags.map((i: any) => i.id).join(','),
                selectedTags: value.tags,
            };
        }
        case COURSE_ACTIONS.SET_PARAMS_TRASH: {
            return {
                ...state,
                status: value,
            };
        }
        case COURSE_ACTIONS.SET_CREATED_BY: {
            return {
                ...state,
                created_by: value,
            };
        }

        default:
            return state;
    }
};
