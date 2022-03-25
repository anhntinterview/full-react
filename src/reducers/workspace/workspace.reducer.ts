// ACTION
import {
    SET_CREATE_WORKSPACE,
    SET_GET_CURRENT_USER_WORKSPACE,
    SET_INVITE_MEMBERS,
    GET_WORKSPACE_DETAIL,
    WORKSPACE_USER_DETAIL,
    WORKSPACE_LESSON,
    WORKSPACE_ADMIN,
    WORKSPACE_COURSES,
    WORKSPACE_SETTING,
    WORKSPACE_TAG,
    CLASSES_INVITE,
} from 'actions/workspace.action';
import { CLASS_LIST } from 'actions/class.action';
// TYPES
import {
    CreateWorkspaceState,
    CreateWorkspaceAction,
} from 'types/CreateWorkspace.type';
import {
    GetListOfWorkspaceState,
    GetListOfWorkspaceAction,
    GetWorkSpaceDetailAction,
    WorkspaceDetailState,
} from 'types/GetListOfWorkspace.type';
import {
    InviteMembersState,
    InviteMembersAction,
} from 'types/InviteMembers.type';
// STATES
import { initCurrentWorkspace } from 'state/Workspace/workspace.state';
import {
    GetWorkSpaceAdminAction,
    WorkspaceAdminPendingListResponse,
} from 'types/AdminWorkspace.type';
import { IClass, IClassAction, IClassResponse } from 'types/Class.type';

export function createWorkspaceReducer(
    state: CreateWorkspaceState,
    action: CreateWorkspaceAction
) {
    switch (action.type) {
        case SET_CREATE_WORKSPACE.REQ_CREATE_WORKSPACE:
            return {
                ...state,
                isLoading: true,
                status: 'pending',
            };
        case SET_CREATE_WORKSPACE.REQ_CREATE_WORKSPACE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                result: action.result,
                status: 'done',
            };
        case SET_CREATE_WORKSPACE.REQ_CREATE_WORKSPACE_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
                status: 'fail',
            };
        default:
            return state;
    }
}

export function inviteMembersReducer(
    state: InviteMembersState,
    action: InviteMembersAction
) {
    switch (action.type) {
        case SET_INVITE_MEMBERS.REQ_INVITE_MEMBERS:
            return {
                ...state,
                isLoading: true,
                status: 'pending',
            };
        case SET_INVITE_MEMBERS.REQ_INVITE_MEMBERS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                result: action.result,
                status: 'done',
            };
        case SET_INVITE_MEMBERS.REQ_INVITE_MEMBERS_FAIL:
            return {
                ...state,
                isLoading: false,
                result: action.result,
                err: action.err,
                valErr: action.valErr,
                status: 'fail',
            };
        default:
            return state;
    }
}

export function getListOfWorkspaceReducer(
    state: GetListOfWorkspaceState,
    action: GetListOfWorkspaceAction
) {
    switch (action.type) {
        case SET_GET_CURRENT_USER_WORKSPACE.REQ_GET_CURRENT_USER_WORKSPACE:
            return {
                ...state,
                isLoading: true,
                status: 'pending',
            };
        case SET_GET_CURRENT_USER_WORKSPACE.REQ_GET_CURRENT_USER_WORKSPACE_SUCCESS:
            return {
                ...state,
                isLoading: false,
                result: action.result,
                status: 'done',
            };
        case SET_GET_CURRENT_USER_WORKSPACE.REQ_GET_CURRENT_USER_WORKSPACE_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
                status: 'fail',
            };
        default:
            return state;
    }
}

export function getWorkspaceDetailReducer(
    state: WorkspaceDetailState,
    action: GetWorkSpaceDetailAction
) {
    switch (action.type) {
        case GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_DETAIL:
            return {
                ...initCurrentWorkspace,
                members: state.members,
                isCreator: state.isCreator,
                id: state.id,
            };
        case GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_DETAIL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                result: action.result,
                status: 'done',
            };
        case GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_DETAIL_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
                status: 'fail',
            };
        case GET_WORKSPACE_DETAIL.RESET_GET_WORKSPACE_FAIL:
            return {
                ...state,
                err: undefined,
                status: '',
            };
        case GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_MEMBERS:
            return {
                ...state,
                isLoadingMember: true,
            };
        case GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_MEMBERS_SUCCESS:
            return {
                ...state,
                isLoadingMember: false,
                members: action.result,
                status: 'fail',
            };
        case GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_MEMBERS_FAIL:
            return {
                ...state,
                isLoadingMember: true,
                err: action.err,
                status: 'fail',
            };
        case GET_WORKSPACE_DETAIL.REQ_SET_WORKSPACE_ID:
            return {
                ...state,
                id: action.id,
            };
        case GET_WORKSPACE_DETAIL.REQ_REMOVE_WORKSPACE_ID:
            return {
                ...state,
                id: -1,
            };
        case WORKSPACE_USER_DETAIL.REQ_SET_USER_CREATOR:
            return {
                ...state,
                isCreator: action.isCreator,
            };
        case WORKSPACE_USER_DETAIL.REQ_SET_USER_ROLE:
            return {
                ...state,
                role: action.role,
            };
        case WORKSPACE_USER_DETAIL.REQ_SET_WORKSPACE_DRIVE_ID:
            return {
                ...state,
                workspaceDriveId: action.workspaceDriveId,
            };
        case GET_WORKSPACE_DETAIL.REQ_SET_CURRENT_UPLOAD_NAVIGATION:
            return {
                ...state,
                currentPath: action.currentPath,
            };
        case WORKSPACE_LESSON.REQ_GET_LESSON_LIST_LOADING:
            return {
                ...state,
                lessonListStatus: 'loading',
                currentLesson: undefined,
            };
        case WORKSPACE_LESSON.REQ_GET_LESSON_LIST_SUCCESS:
            return {
                ...state,
                lessonList: action.lessonList,
                lessonListStatus: 'done',
            };
        case WORKSPACE_LESSON.REQ_GET_LESSON_LIST_FAIL:
            return {
                ...state,
                lessonListError: action.lessonListError,
                lessonListStatus: 'error',
            };
        case WORKSPACE_LESSON.REQ_GET_LESSON_TAG:
            return {
                ...state,
            };
        case WORKSPACE_LESSON.REQ_GET_LESSON_TAG_FINISH:
            return {
                ...state,
                tagList: action.tagList,
            };
        case WORKSPACE_LESSON.REQ_GET_LESSON_TAG_ERROR:
            return {
                ...state,
            };
        case WORKSPACE_LESSON.REQ_SET_CURRENT_LESSON_INIT:
            return {
                ...state,
                currentLesson: undefined,
                updateStatus: 'init',
            };
        case WORKSPACE_LESSON.REQ_SET_CURRENT_LESSON:
            return {
                ...state,
                currentLesson: action.currentLesson,
            };
        case WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL: {
            return {
                ...state,
                isUpdatingLesson: true,
                updateStatus: 'init',
            };
        }
        case WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL_FINISH: {
            return {
                ...state,
                isUpdatingLesson: false,
                currentLesson: {
                    ...state.currentLesson,
                    ...action.currentLesson,
                },
                updateStatus: 'done',
            };
        }
        case WORKSPACE_TAG.REQ_UPDATE_TAG_FAILED: {
            return {
                ...state,
                tagResult: 3,
                updateStatus: 'error',
                course: {
                    ...state.course,
                    updateDetailStatus: 'tags_error',
                },
            };
        }
        case WORKSPACE_TAG.REQ_UPDATE_TAG_ADD_FAILED: {
            return {
                ...state,
                tagResult: 1,
                updateStatus: 'error',
                course: {
                    ...state.course,
                    updateDetailStatus: 'tags_error',
                },
            };
        }
        case WORKSPACE_TAG.REQ_UPDATE_TAG_REMOVE_FAILED: {
            return {
                ...state,
                tagResult: 2,
                updateStatus: 'error',
                course: {
                    ...state.course,
                    updateDetailStatus: 'tags_error',
                },
            };
        }
        case WORKSPACE_TAG.REQ_UPDATE_TAG_FINISH: {
            return {
                ...state,
                tagResult: 4,
                course: {
                    ...state.course,
                    updateDetailStatus: 'done',
                },
            };
        }
        case WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL_ERROR: {
            return {
                ...state,
                isUpdatingLesson: false,
                updateStatus: 'error',
            };
        }
        case WORKSPACE_COURSES.REQ_GET_COURSES_LIST: {
            return {
                ...state,
                course: {
                    ...state.course,
                    loading: true,
                    detail: undefined,
                    loadingDetail: false,
                },
            };
        }
        case WORKSPACE_COURSES.REQ_GET_COURSES_LIST_FINISH: {
            return {
                ...state,
                course: {
                    ...state.course,
                    list: action.course,
                    loading: false,
                },
            };
        }
        case WORKSPACE_COURSES.REQ_GET_COURSE_DETAIL: {
            return {
                ...state,
                course: {
                    ...state.course,
                    loadingDetail: true,
                    detail: {
                        ...state.course.detail,
                        tags: [],
                        ...action.value,
                    },
                },
            };
        }
        case WORKSPACE_COURSES.REQ_GET_COURSES_DETAIL_FINISH: {
            return {
                ...state,
                course: {
                    ...state.course,
                    loadingDetail: false,
                    detail: { ...state.course.detail, ...action.value },
                },
            };
        }
        case WORKSPACE_COURSES.REQ_UPDATE_COURSE_DETAIL: {
            return {
                ...state,
                course: {
                    ...state.course,
                    loadingDetail: true,
                    updateDetailStatus: 'init',
                },
            };
        }
        case WORKSPACE_COURSES.REQ_UPDATE_COURSE_DETAIL_FINISH: {
            return {
                ...state,
                course: {
                    ...state.course,
                    loadingDetail: false,
                    updateDetailStatus: 'done',
                },
            };
        }
        case WORKSPACE_COURSES.REQ_UPDATE_COURSE_DETAIL_ERROR: {
            return {
                ...state,
                course: {
                    ...state.course,
                    loadingDetail: false,
                    updateDetailStatus: action.value,
                },
            };
        }
        case WORKSPACE_SETTING.REQ_UPDATE_WORKSPACE: {
            return {
                ...state,
                isUpdatingWorkspace: true,
                updateWorkspaceStatus: 'init',
            };
        }
        case WORKSPACE_SETTING.REQ_UPDATE_WORKSPACE_FINISH: {
            return {
                ...state,
                isUpdatingWorkspace: false,
                updateWorkspaceStatus: 'done',
                result: { ...state.result, ...action.result },
            };
        }
        case WORKSPACE_SETTING.REQ_UPDATE_WORKSPACE_ERROR: {
            console.log('err');
            return {
                ...state,
                isUpdatingWorkspace: false,
                updateWorkspaceStatus: 'error',
            };
        }
        case WORKSPACE_SETTING.RESET_UPDATE_WORKSPACE: {
            return {
                ...state,
                isUpdatingWorkspace: false,
                updateWorkspaceStatus: 'init',
            };
        }
        case GET_WORKSPACE_DETAIL.REQ_SET_CURRENT_ROUTE_DETAIL: {
            return {
                ...state,
                currentRouteDetail: action.currentRouteDetail,
            };
        }
        case CLASS_LIST.REQ_GET_CLASSLIST: {
            return {
                ...state,
                class: {
                    ...state.class,
                    list: {
                        ...state.class.list,
                        isLoading: true,
                    },
                },
            };
        }
        case CLASS_LIST.REQ_GET_CLASSLIST_SUCCESS: {
            return {
                ...state,
                class: {
                    ...state.class,
                    list: {
                        isLoading: false,
                        ...action.value,
                    },
                },
            };
        }
        case CLASS_LIST.REQ_GET_CLASS_DETAIL: {
            return {
                ...state,
                class: {
                    ...state.class,
                    detail: undefined,
                    getDetailStatus: 'loading',
                },
            };
        }
        case CLASS_LIST.REQ_GET_CLASS_DETAIL_SUCCESS: {
            return {
                ...state,
                class: {
                    ...state.class,
                    detail: action.value,
                    getDetailStatus: 'done',
                },
            };
        }
        case CLASS_LIST.REQ_GET_CLASS_DETAIL_FAIL: {
            return {
                ...state,
                class: {
                    ...state.class,
                    getDetailStatus: 'error',
                },
            };
        }
        case CLASS_LIST.REQ_UPDATE_CLASS: {
            return {
                ...state,
                class: {
                    ...state.class,
                    getDetailStatus: 'loading',
                },
            };
        }
        case CLASS_LIST.REQ_RESET_CLASS_DETAIL_STATUS: {
            return {
                ...state,
                class: {
                    ...state.class,
                    getDetailStatus: 'init',
                },
            };
        }
        case CLASS_LIST.REQ_UPDATE_CLASS_SUCCESS: {
            return {
                ...state,
                class: {
                    ...state.class,
                    detail: {
                        ...state.class.detail,
                        ...action.value,
                    },
                    getDetailStatus: 'done_update',
                },
            };
        }
        case CLASS_LIST.REQ_UPDATE_CLASS_FAIL: {
            return {
                ...state,
                class: {
                    ...state.class,
                    getDetailStatus: 'error_update',
                    getDetailError: action.value,
                },
            };
        }
        case CLASS_LIST.REQ_GET_CLASS_SESSION: {
            return {
                ...state,
                class: {
                    ...state.class,
                },
            };
        }
        case CLASS_LIST.REQ_GET_CLASS_SESSION_SUCCESS: {
            return {
                ...state,
                class: {
                    ...state.class,
                    sessions: action.value,
                },
            };
        }
        case CLASS_LIST.REQ_GET_CLASSLIST_FAIL: {
            return {
                ...state,
                class: {
                    ...state.class,
                },
            };
        }
        case CLASSES_INVITE.REQ_GET_MEMBER: {
            return {
                ...state,
                class: {
                    ...state.class,
                    loading: true,
                },
            };
        }
        case CLASSES_INVITE.REQ_GET_MEMBER_SUCCESS: {
            return {
                ...state,
                class: {
                    ...state.class,
                    loading: false,
                    userAvailable: true,
                    userClassesInvite: action.class.userClassesInvite,
                    userWorkspaceInvite: action.class.userWorkspaceInvite,
                },
            };
        }
        case CLASSES_INVITE.REQ_GET_MEMBER_CLASSES_NOT_AVAILABLE: {
            return {
                ...state,
                class: {
                    ...state.class,
                    loading: false,
                    userAvailable: false,
                },
            };
        }
        case CLASSES_INVITE.REQ_GET_MEMBER_WORKSPACE_SUCCESS: {
            return {
                ...state,
                class: {
                    ...state.class,
                    userWorkspaceInvite: action.value,
                    loading: false,
                },
            };
        }
        case CLASSES_INVITE.REQ_GET_MEMBER_ClASSES_SUCCESS: {
            return {
                ...state,
                class: {
                    ...state.class,
                    userClassesInvite: action.value,
                    loading: false,
                },
            };
        }
        case CLASSES_INVITE.REQ_GET_MEMBER_WORKSPACE_NOT_AVAILABLE: {
            return {
                ...state,
                class: {
                    ...state.class,
                    userClassesInvite: undefined,
                    userWorkspaceInvite: undefined,
                    loading: false,
                },
            };
        }
        case CLASSES_INVITE.REQ_GET_MEMBER_FAILED: {
            return {
                ...state,
                class: {
                    ...state.class,
                    loading: false,
                    userClassesInvite: undefined,
                    userAvailable: undefined,
                    getInviteStatus: 'fail',
                },
            };
        }
        case CLASSES_INVITE.REQ_GET_STUDENT: {
            return {
                ...state,
                class: {
                    ...state.class,
                    loading: true,
                },
            };
        }
        case CLASSES_INVITE.REQ_GET_STUDENT_FINISH: {
            return {
                ...state,
                class: {
                    ...state.class,
                    listStudent: action.value,
                    loading: false,
                },
            };
        }
        case CLASSES_INVITE.REQ_GET_STUDENT_FAILED: {
            return {
                ...state,
                class: {
                    ...state.class,
                    listStudent: undefined,
                    loading: true,
                },
            };
        }
        case CLASSES_INVITE.REQ_GET_TEACHER: {
            return {
                ...state,
                class: {
                    ...state.class,
                    loading: true,
                },
            };
        }
        case CLASSES_INVITE.REQ_GET_TEACHER_FINISH: {
            return {
                ...state,
                class: {
                    ...state.class,
                    listTeacher: action.value,
                    loading: false,
                },
            };
        }
        case CLASSES_INVITE.REQ_GET_TEACHER_FAILED: {
            return {
                ...state,
                class: {
                    ...state.class,
                    listStudent: undefined,
                    loading: true,
                },
            };
        }

        case CLASSES_INVITE.REQ_INVITE_EMAIL: {
            return {
                ...state,
                class: {
                    ...state.class,
                    inviteEmailClassesStatus: 'init',
                },
            };
        }
        case CLASSES_INVITE.REQ_INVITE_EMAIL_FINISH: {
            return {
                ...state,
                class: {
                    ...state.class,
                    inviteEmailClassesStatus: 'done',
                    typeInvite: action.value,
                },
            };
        }
        case CLASSES_INVITE.REQ_INVITE_EMAIL_FAILED: {
            return {
                ...state,
                class: {
                    ...state.class,
                    inviteEmailClassesStatus: 'error',
                },
            };
        }
        case CLASSES_INVITE.REQ_INVITE_EMAIL_FAILED_INVALID: {
            return {
                ...state,
                class: {
                    ...state.class,
                    inviteEmailClassesStatus: 'invalid_error',
                },
            };
        }

        case CLASSES_INVITE.REQ_REMOVE_MEMBER: {
            return {
                ...state,
                class: {
                    ...state.class,
                    statusRemoveMember: 'init',
                    propertiesRemove: action.value,
                },
            };
        }
        case CLASSES_INVITE.REQ_REMOVE_MEMBER_SUCCESS: {
            return {
                ...state,
                class: {
                    ...state.class,
                    statusRemoveMember: 'done',
                },
            };
        }
        case CLASSES_INVITE.REQ_REMOVE_MEMBER_FAILED: {
            return {
                ...state,
                class: {
                    ...state.class,
                    statusRemoveMember: 'error',
                    propertiesRemove: undefined,
                },
            };
        }
        case CLASSES_INVITE.REQ_RESET_STATUS_CLASSES: {
            return {
                ...state,
                class: {
                    ...state.class,
                    statusRemoveMember: 'init',
                    inviteEmailClassesStatus: 'init',
                },
            };
        }
        case CLASSES_INVITE.REQ_RESET_INVITE_CLASSES: {
            return {
                ...state,
                class: {
                    ...state.class,
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
                    statusRemoveMember: 'init',
                    propertiesRemove: {
                        userId: -1,
                        typeOption: 'init',
                    },
                    typeInvite: undefined,

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
            };
        }

        case CLASSES_INVITE.REQ_INVITE_TEACHER_AS_ME: {
            return {
                ...state,
                result: {
                    ...state.result,
                    membership: {
                        ...state.result.membership,
                        type: 'teacher'
                    }
                }
            };
        }

        default:
            return state;
    }
}

export function getWorkspaceAdminReducer(
    state: WorkspaceAdminPendingListResponse,
    action: GetWorkSpaceAdminAction
): WorkspaceAdminPendingListResponse {
    switch (action.type) {
        case WORKSPACE_ADMIN.REQ_GET_ADMIN_LIST:
        case WORKSPACE_ADMIN.REQ_ADMIN_APPROVE:
        case WORKSPACE_ADMIN.REQ_ADMIN_DECLINE:
            return {
                ...state,
                isLoading: true,
            };
        case WORKSPACE_ADMIN.REQ_GET_ADMIN_LIST_FINISH:
            return {
                ...state,
                items: action.items,
                total: action.total,
                isLoading: false,
            };
        case WORKSPACE_ADMIN.REQ_ADMIN_APPROVE_ERROR:
        case WORKSPACE_ADMIN.REQ_ADMIN_DECLINE_ERROR:
            return {
                ...state,
                isLoading: false,
            };
        case WORKSPACE_ADMIN.REQ_ADMIN_CHANGE_ORDER:
            return {
                ...state,
                order: state.order === 'asc' ? 'desc' : 'asc',
            };
        case WORKSPACE_ADMIN.REQ_GET_ADMIN_FILTER:
            return {
                ...state,
                items: action.items,
                params: action.params,
                total: action.total,
                isLoading: false,
            };
        default:
            return state;
    }
}
