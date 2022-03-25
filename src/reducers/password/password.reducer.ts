// ACTION
import { SET_PASSWORD } from 'actions/password.action';
import {
    UpdatePasswordState,
    UpdatePasswordAction,
} from 'types/UpdatePassword.type';
import {
    ForgotPasswordState,
    ForgotPasswordAction,
} from 'types/ForgotPassword.type';
import {
    ResetPasswordState,
    ResetPasswordAction,
} from 'types/ResetPassword.type';
// STATES
import { initPasswordState } from 'state/Password/password.state';

export default function workspaceReducer(
    state: UpdatePasswordState & ForgotPasswordState & ResetPasswordState,
    action: UpdatePasswordAction & ForgotPasswordAction & ResetPasswordAction
) {
    switch (action.type) {
        case SET_PASSWORD.REQ_SET_PASSWORD:
            return {
                ...state,
                isLoading: true,
                status: 'pending',
                forgotPasswordResult:undefined,
            };
        case SET_PASSWORD.REQ_UPDATE_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                result: action.result,
                status: 'done',
            };
        case SET_PASSWORD.REQ_UPDATE_PASSWORD_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
                valErr: action.valErr,
                status: 'fail',
            };
        case SET_PASSWORD.REQ_FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                forgotPasswordResult: action.forgotPasswordResult,
                status: 'done',
            };
        case SET_PASSWORD.REQ_FORGOT_PASSWORD_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
                valErr: action.valErr,
                status: 'fail',
            };
        case SET_PASSWORD.REQ_RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                resetPasswordResult: action.resetPasswordResult,
                status: 'done',
            };
        case SET_PASSWORD.REQ_RESET_PASSWORD_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
                valErr: action.valErr,
                status: 'fail',
            };
        case SET_PASSWORD.REQ_PASSWORD_RESET:
            return initPasswordState;
        default:
            return state;
    }
}
