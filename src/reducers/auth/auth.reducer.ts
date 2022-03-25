import {SET_AUTH} from 'actions/auth.action';
import {AuthState, AuthAction} from 'types/Auth.type';
import {initAuthState} from "state/Auth/auth.state";

export default function authReducer(state: AuthState, action: AuthAction) {
    switch (action.type) {
        // LOGIN
        case SET_AUTH.REQ_AUTH:
            return {
                ...state,
                isLoading: true,
                params: action.params,
                status: 'pending',
            };
        case SET_AUTH.LOGIN_WITH_DEFAULT_PASSWORD:
            return {
                ...state,
                defaultPassword: action.result,
            };
        case SET_AUTH.LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                result: action.result,
                status: 'done',
                err: undefined,
            };
        case SET_AUTH.REMOVE_DEFAULT_PASSWORD_MODALS:
            return {
                ...state,
                isLoading: false,
                result: {...state.result, defaultPassword: undefined},
                status: 'done',
            };
        case SET_AUTH.LOGIN_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err && action.err,
                status: 'fail',
            };
        case SET_AUTH.RESET_LOGIN_STATE:
            return {
                ...state,
                isLoading: false,
                err: undefined,
                status: '',
            };
        // LOGOUT
        case SET_AUTH.LOGOUT:
            return initAuthState;
        default:
            return state;
    }
}
