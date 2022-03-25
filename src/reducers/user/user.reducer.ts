import { SET_USER } from 'actions/user.action';
import {
    UserState,
    UserAction,
    UpdateUserState,
    UpdateUserAction,
    UploadAvatarState,
    UploadeAvatarAction,
} from 'types/User.type';
import {
    initUpdateUserState,
    initUserState,
} from '../../state/User/user.state';

export function userReducer(state: UserState, action: UserAction) {
    switch (action.type) {
        case SET_USER.RESET_USER_INFORMATION:
            return {
                ...initUserState,
            };
        case SET_USER.REQ_USER:
            return {
                ...state,
                isLoading: true,
                params: action.params,
                status: 'pending',
            };
        case SET_USER.REQ_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                result: action.result,
                status: 'done',
                err: 'none',
            };
        case SET_USER.REQ_USER_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action?.err,
                validateErr: action?.errVal,
                status: 'fail',
            };
        case SET_USER.REQ_USER_ROLE:
            return {
                ...state,
                role: action.role,
            };
        case SET_USER.REQ_SET_CREATOR:
            return {
                ...state,
                isCreator: action.isCreator,
            };
        default:
            return state;
    }
}

export function updateUserReducer(
    state: UpdateUserState,
    action: UpdateUserAction
) {
    switch (action.type) {
        case SET_USER.REQ_UPDATE_USER:
            return {
                ...state,
                isLoading: true,
                params: action.params,
                status: 'pending',
            };
        case SET_USER.REQ_UPDATE_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                result: action.result,
                status: 'done',
            };
        case SET_USER.REQ_UPDATE_USER_FAIL:
            return {
                ...state,
                isLoading: true,
                err: action.err,
                status: 'fail',
            };
        case SET_USER.REQ_RESET_RESULT:
            return initUpdateUserState;
        default:
            return state;
    }
}

export function uploadAvatarReducer(
    state: UploadAvatarState,
    action: UploadeAvatarAction
) {
    switch (action.type) {
        // Step 1: get info file
        case SET_USER.REQ_UPLOAD_AVATAR:
            return {
                ...state,
                isLoading: true,
                params: action.params,
                status: 'pending',
            };
        // Step 2: upload to AWS
        case SET_USER.REQ_UPLOAD_AVATAR_FORM_DATA_SUCCESS:
            return {
                ...state,
                isLoading: false,
                path: action.path,
                avatarFinalErr: undefined,
                avatarFinalValidateErr: undefined,
                formDataErr: undefined,
                err: undefined,
                errVal: undefined,
                status: 'done',
            };
        case SET_USER.REQ_UPLOAD_AVATAR_FORM_DATA_FAIL:
            return {
                ...state,
                isLoading: true,
                formDataErr: action.err,
                status: 'fail',
            };
        // Step 3: save and get avatar_url
        case SET_USER.REQ_UPLOAD_AVATAR_FINAL_SUCCESS:
            return {
                ...state,
                isLoading: false,
                avatarFinalResult: action.result,
                avatarFinalErr: undefined,
                avatarFinalValidateErr: undefined,
                formDataErr: undefined,
                err: undefined,
                errVal: undefined,
                status: 'done',
            };
        case SET_USER.REQ_UPLOAD_AVATAR_FINAL_FAIL:
            return {
                ...state,
                isLoading: true,
                avatarFinalErr: action.err,
                status: 'fail',
            };
        case SET_USER.REQ_REFRESH_UPLOAD_AVATAR_PROCESS:
            return {
                ...state,
                avatarFinalResult: undefined,
                result: undefined,
                path: undefined,
            };
        default:
            return state;
    }
}
