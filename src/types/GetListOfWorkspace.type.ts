import {
    IClass,
    IClasslistState,
    IClassSessionResponse,
    MembersClassesType,
} from './Class.type';
import { NormalResponseError, ValidateResponseErrors } from './Common.type';
import { CourseDetailType, ICourseResponse } from './Courses.type';
import { SectionFile } from './Lesson.type';

export type GetListOfWorkspaceType = {
    items: WorkspaceItem[];
    page: number;
    per_page: number;
    total: number;
    sort_by: string;
    order: string;
};

export type WorkspaceItem = {
    id: number;
    is_creator: boolean;
    name: string;
    status: string;
    subdomain?: string | undefined;
    email: string;
    description: string;
    phone: string;
    fax: string;
    address: string;
    membership_status: string;
    membership: {
        id: number;
        status: string;
        is_creator: boolean;
        role: string;
        last_visited: string | null;
        user_id: number;
        type: string | null;
    };
    avatar_url?: string | undefined;
    drive_default_path: string;
};

export type WorkspaceMember = {
    id: number;
    email: string;
    name: string;
    time_zone: string;
    avatar_url: string;
    is_creator: boolean;
    role: string;
    membership_status: string;
    membership: {
        id: number;
        is_creator: boolean;
        role: string;
        status: string;
        user_id: number;
        workspace_id: number;
        last_visited: string;
        type: string;
    };
    last_visited: string;
    first_name: string;
    display_name: string;
    last_name: string;
};

export interface GetListOfWorkspaceState {
    isLoading: boolean;
    result: GetListOfWorkspaceType;
    params: string;
    status: string;
    err: NormalResponseError | undefined;
}

interface User {
    id: number;
    email: string;
    name: string;
    time_zone: string;
    avatar_url: string;
    display_name: string;
}

export interface TagType {
    id: number;
    workspace_id: number;
    name: string;
    color: string;
    created_on: string;
    updated_on: string;
}

export interface LessonSection {
    description: string;
    files: SectionFile[];
    title: string;
}

export interface LessonInterface {
    id: number;
    uid: string;
    uuid: string;
    workspace_id: number;
    title: string;
    skill_summary: string;
    status: 'draft' | 'pending' | 'public' | 'archive' | 'trash';
    created_on: string;
    created_by: User;
    updated_on: string;
    updated_by: User;
    collaborators: User[];
    tags: TagType[] | undefined;
    sections: LessonSection[];
}

export interface Lesson {
    items: LessonInterface[] | undefined;
    page: number;
    per_page: number;
    total: number;
    sort_by: 'updated_on' | 'created_on' | 'title.keyword';
    order: 'desc' | 'asc';
}

export interface LessonResponse extends Lesson {}

export interface MembersWorkspaceType {
    items: WorkspaceMember[];
    page: number;
    per_page: number;
    total: number;
    sort_by: string;
    order: string;
}

export interface SelectOptionType {
    user_id: number;
    value: string;
    label: string;
    isFixed?: boolean;
    isDisabled?: boolean;
}

export interface BodyInviteEmail {
    email: string;
    type: string;
}

export interface MemberInviteType {
    members: BodyInviteEmail[];
    typeInvite: 'teacher' | 'student';
}

export interface WorkspaceDetailState {
    id: number;
    isLoadingMember: boolean;
    isUpdatingLesson: boolean;
    updateStatus: 'init' | 'done' | 'error';
    result: WorkspaceItem;
    members: MembersWorkspaceType;
    params: string;
    status: string;
    err: NormalResponseError | undefined;
    validateErr: ValidateResponseErrors | undefined;

    isCreator: boolean | undefined;
    role: string;

    workspaceDriveId: string;
    workspaceDriveErr: string;

    currentPath: number;
    lessonList: Lesson;
    tagResult: number;
    lessonListStatus: string;
    lessonListError: string;
    currentLesson: LessonInterface | undefined;

    tagList: {
        items: TagType[];
        total: number;
        page: number;
        per_page: number;
        sort_by: string;
        order: string;
    };

    class: {
        loading: boolean;
        userClassesInvite: MembersWorkspaceType;
        userWorkspaceInvite: MembersWorkspaceType;
        userAvailable: boolean | undefined;
        list: IClasslistState;
        detail: IClass | undefined;
        getDetailStatus: 'init' | 'done' | 'error' | 'loading' | 'error_update';
        inviteEmailClassesStatus:
            | 'init'
            | 'done'
            | 'error'
            | 'loading'
            | 'invalid_error';
        typeInvite: 'teacher' | 'student' | undefined;
        sessions: IClassSessionResponse;
        getInviteStatus: string;

        listTeacher: MembersClassesType;
        listStudent: MembersClassesType;
        statusRemoveMember: 'init' | 'done' | 'error';
        propertiesRemove: {
            userId: number;
            typeOption: 'student' | 'teacher' | 'init';
        };

        getDetailError: NormalResponseError | undefined;
    };

    course: {
        list: ICourseResponse;
        loading: boolean;

        detail: CourseDetailType | undefined;
        loadingDetail: boolean;
        updateDetailStatus: 'init' | 'done' | 'error' | 'tags_error';
    };

    updateWorkspaceStatus: 'init' | 'done' | 'error';
    isUpdatingWorkspace: boolean;

    currentRouteDetail: { name: string; routeId: string }[];
}

export interface GetListOfWorkspaceAction extends GetListOfWorkspaceState {
    type: string;
}

export interface GetWorkSpaceDetailAction extends WorkspaceDetailState {
    type: string;
    value?: any;
}

export interface GetWorkspaceDetailArgs {
    id: string;
}

export type GetListOfWorkspaceBodyType = {
    access_token: string;
};

export type WorkspaceMemberResponse = {
    items: WorkspaceMember[];
    page: number;
    per_page: number;
    total: number;
    sort_by: string;
    order: string;
};
