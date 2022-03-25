import { WorkspaceAdminPendingListResponse } from 'types/AdminWorkspace.type';
import { IClass, IClasslistState, IClassSessionState } from 'types/Class.type';
import { ICourseResponse } from 'types/Courses.type';
import { CreateWorkspaceState } from 'types/CreateWorkspace.type';
import {
    GetListOfWorkspaceState,
    Lesson,
    WorkspaceDetailState,
} from 'types/GetListOfWorkspace.type';
import { InviteMembersState } from 'types/InviteMembers.type';

export const initCreateWorkspaceState: CreateWorkspaceState = {
    isLoading: false,
    result: {
        // CreateWorkspaceState
        id: undefined,
        name: undefined,
        subdomain: null,
    },
    params: '',
    status: '',
    err: undefined,
};

export const initInviteMembersStateState: InviteMembersState = {
    isLoading: false,
    result: undefined,
    params: '',
    status: '',
    err: undefined,
    valErr: undefined,
};

export const initGetListOfWorkspaceState: GetListOfWorkspaceState = {
    isLoading: false,
    result: {
        // GetListOfWorkspaceState
        items: [],
        page: 1,
        per_page: 10,
        total: 0,
        sort_by: '',
        order: '',
    },
    params: '',
    status: '',
    err: undefined,
};

export const initLessonList: Lesson = {
    items: undefined,
    page: -1,
    per_page: -1,
    order: 'asc',
    sort_by: 'created_on',
    total: -1,
};

export const initCourseList: ICourseResponse = {
    items: [],
    page: 1,
    per_page: 10,
    sort_by: 'updated_on',
    total: 0,
};

export const initCurrentPendingAdminWorkspace: WorkspaceAdminPendingListResponse = {
    items: [],
    isLoading: false,
    total: 0,
    order: 'asc',
    params: {
        page: 1,
        per_page: 10,
        sort_by: 'updated_on',
        order: 'asc',
        created_by: '',
        status: 'pending',
        type: '',
    },
};

export const initClasslistState: IClasslistState = {
    isLoading: false,
    items: [],
    total: 0,
    order: 'asc',
    page: 1,
    per_page: 10,
    sort_by: 'updated_on',
};
export const initClassSessionState: IClassSessionState = {
    items: [],
    total: 0,
    order: 'asc',
    page: 1,
    per_page: 10,
    sort_by: 'updated_on',
};

export const initCurrentWorkspace: WorkspaceDetailState = {
    id: -1,
    isLoadingMember: false,
    isUpdatingLesson: false,
    updateStatus: 'init',
    result: {
        id: -1,
        is_creator: false,
        name: '',
        status: '',
        email: '',
        description: '',
        phone: '',
        fax: '',
        address: '',
        membership_status: '',
        membership: {
            id: -1,
            is_creator: false,
            last_visited: '',
            role: '',
            status: '',
            user_id: -1,
            type: null,
        },
        drive_default_path: '',
    },
    members: {
        items: [],
        page: 1,
        per_page: 10,
        total: 0,
        sort_by: '',
        order: '',
    },
    params: '',
    status: '',
    err: undefined,
    validateErr: undefined,

    isCreator: undefined,
    role: '',

    workspaceDriveErr: '',
    workspaceDriveId: '',

    currentPath: -1,

    lessonList: initLessonList,
    lessonListStatus: 'init',
    lessonListError: '',
    currentLesson: undefined,

    tagList: {
        items: [],
        page: 1,
        per_page: 10,
        total: 0,
        order: 'desc',
        sort_by: 'updated_on',
    },
    course: {
        list: {
            items: [],
            page: 1,
            total: 0,
            per_page: 10,
            sort_by: 'updated_on',
        },
        loading: false,

        loadingDetail: false,
        detail: undefined,
        updateDetailStatus: 'init',
    },

    class: {
        loading: false,
        userClassesInvite: {
            items: [],
            page: 1,
            per_page: 10,
            total: 0,
            sort_by: '',
            order: '',
        },
        userWorkspaceInvite: {
            items: [],
            page: 1,
            per_page: 10,
            total: 0,
            sort_by: '',
            order: '',
        },
        inviteEmailClassesStatus: 'init',
        userAvailable: undefined,
        list: initClasslistState,
        detail: undefined,
        getDetailStatus: 'init',
        statusRemoveMember: 'init',
        propertiesRemove: {
            userId: -1,
            typeOption: 'init',
        },
        typeInvite: undefined,
        getDetailError: undefined,

        sessions: initClassSessionState,
        getInviteStatus: 'init',
        listStudent: {
            items: [],
            page: 1,
            per_page: 10,
            total: 0,
            sort_by: '',
            order: '',
        },
        listTeacher: {
            items: [],
            page: 1,
            per_page: 10,
            total: 0,
            sort_by: '',
            order: '',
        },
    },

    updateWorkspaceStatus: 'init',
    isUpdatingWorkspace: false,

    currentRouteDetail: [],
    tagResult: 0,
};
