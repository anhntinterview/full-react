import {SET_REGISTER} from 'actions/auth.action';
import {RegisterState, RegisterAction} from 'types/Register.type';
import {initRegisterState} from 'state/Auth/register.state';
import {AuthType} from 'types/Auth.type';

export default function registerReducer(
    state: RegisterState,
    action: RegisterAction
) {
    console.log(action);

    switch (action.type) {
        case SET_REGISTER.REQ_REGISTER:
            return {
                ...state,
                isLoading: true,
                status: 'pending',
            };
        case SET_REGISTER.REQ_REGISTER_TEMPORARY_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                registerResult: action.registerResult,
                err: undefined,
                status: 'done',
            };
        case SET_REGISTER.REQ_REGISTER_TEMPORARY_USER_FAIL:
            return {
                ...state,
                isLoading: false,
                err: {...action.err},
                status: 'fail',
            };
        case SET_REGISTER.REQ_REGISTER_VERIFY_EMAIL_SUCCESS:
            // RE-ASSIGN ACCESS_TOKEN TOTEMPORARY_ACCESS_TOKEN
            return {
                ...state,
                isLoading: false,
                verifyEmailResult: {
                    ...action.verifyEmailResult,
                    temporary_access_token:
                    action.verifyEmailResult?.access_token,
                    access_token: undefined,
                },
                err: undefined,
                status: 'done',
            };
        case SET_REGISTER.REQ_REGISTER_VERIFY_EMAIL_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
                status: 'fail',
            };
        case SET_REGISTER.REQ_REGISTER_NEW_PASSWORD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                createNewPasswordResult: action.createNewPasswordResult,
                err: undefined,
                status: 'done',
            };
        case SET_REGISTER.REQ_REGISTER_NEW_PASSWORD_FAIL:
            return {
                ...initRegisterState,
                isLoading: false,
                err: action.err,
                status: 'fail',
            };
        case SET_REGISTER.REQ_CLEAR_ERROR:
            return {
                ...state,
                valErr: undefined,
                err: undefined,
                status: '',
            };
        case SET_REGISTER.REQ_RESET_RESULT:
            return initRegisterState;
        default:
            return state;
    }
}
