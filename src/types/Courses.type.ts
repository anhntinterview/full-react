import { SortType, StatusType } from './ApiData.type';
import { Lesson, LessonInterface, TagType } from './GetListOfWorkspace.type';
import { TagsType } from './H5P.type';

export type CourseUserType = {
    id: 0;
    email: string;
    first_name: string;
    last_name: string;
    display_name: string;
    avatar_url: string;
};

export type TagsCourseType = {
    id: number;
    workspace_id: number;
    name: string;
    color: string;
    created_on: string;
    updated_on: string;
};

//list response
export type CourseType = {
    readonly id: number;
    readonly uid: string;
    readonly thumbnail: string;
    title: string;
    status: StatusType;
    readonly created_by: CourseUserType;
    updated_on: string;
};

//detail response
export type CourseDetailType = CourseType & {
    workspace_id?: string;
    level?: string;
    requirements?: string;
    duration?: string;
    result?: string;
    short_description?: string;
    full_description?: string;
    created_on?: string;
    updated_by?: CourseUserType;
    published_on?: string;
    collaborators?: CourseUserType[];
    tags?: TagType[];
    lessons?: LessonInterface[];
};

export interface ICourseResponse {
    items: CourseType[];
    total: number;
    page: number;
    per_page: number;
    sort_by: SortType;
}
