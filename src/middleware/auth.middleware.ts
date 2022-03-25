import * as React from 'react';
// ACTIONS
import { SET_AUTH } from 'actions/auth.action';
import { SET_PASSWORD } from 'actions/password.action';
// SERVICES
import { AuthService } from 'services';
// TYPES
import { AuthLoginBodyType } from 'types/Auth.type';
import { ForgotPasswordArgsType } from 'types/ForgotPassword.type';
import { ResetPasswordArgsType } from 'types/ResetPassword.type';

const login = (dispatch: React.Dispatch<any>, body: AuthLoginBodyType) => {
    dispatch({ type: SET_AUTH.REQ_AUTH });
    AuthService.login(body)
        .then((result) => {
            dispatch({
                type: SET_AUTH.LOGIN_SUCCESS,
                result,
            });
            localStorage.setItem('user-data', JSON.stringify(result));
        })
        .catch((error) => {
            dispatch({ type: SET_AUTH.LOGIN_FAIL, err: error });
        });
};

function removeDefaultPasswordModal(dispatch: React.Dispatch<any>) {
    dispatch({ type: SET_AUTH.REMOVE_DEFAULT_PASSWORD_MODALS });
}

const forgotPassword = (
    dispatch: React.Dispatch<any>,
    body: ForgotPasswordArgsType
) => {
    dispatch({ type: SET_PASSWORD.REQ_SET_PASSWORD });
    try {
        AuthService.forgotPassword(body)
            .then((result) => {
                if (result) {
                    if (result.status === 204) {
                        dispatch({
                            type: SET_PASSWORD.REQ_FORGOT_PASSWORD_SUCCESS,
                            forgotPasswordResult: result.status,
                        });
                    }
                    // rs.then((r) => {
                    //     if (r.error) {
                    //         dispatch({
                    //             type: SET_PASSWORD.REQ_FORGOT_PASSWORD_FAIL,
                    //             err: r,
                    //         });
                    //     }
                    //     if (r.validation_error) {
                    //         dispatch({
                    //             type: SET_PASSWORD.REQ_FORGOT_PASSWORD_FAIL,
                    //             valErr: r,
                    //         });
                    //     }
                    // });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                dispatch({
                    type: SET_PASSWORD.REQ_FORGOT_PASSWORD_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_PASSWORD.REQ_FORGOT_PASSWORD_FAIL,
            err: err.toJSON().message,
        });
    }
};

const resetPassword = (
    dispatch: React.Dispatch<any>,
    body: ResetPasswordArgsType
) => {
    dispatch({ type: SET_PASSWORD.REQ_SET_PASSWORD });
    try {
        AuthService.resetPassword(body)
            .then((result) => {
                if (result) {
                    if (result.status === 204) {
                        dispatch({
                            type: SET_PASSWORD.REQ_RESET_PASSWORD_SUCCESS,
                            resetPasswordResult: result.status,
                        });
                    }
                    // rs.then((r) => {
                    //     if (r.error) {
                    //         dispatch({
                    //             type: SET_PASSWORD.REQ_RESET_PASSWORD_FAIL,
                    //             err: r,
                    //         });
                    //     }
                    //     if (r.validation_error) {
                    //         dispatch({
                    //             type: SET_PASSWORD.REQ_RESET_PASSWORD_FAIL,
                    //             valErr: r,
                    //         });
                    //     }
                    // });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                dispatch({
                    type: SET_PASSWORD.REQ_RESET_PASSWORD_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_PASSWORD.REQ_RESET_PASSWORD_FAIL,
            err: err.toJSON().message,
        });
    }
};

const resetPasswordState = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: SET_PASSWORD.REQ_PASSWORD_RESET });
};

const resetLoginState = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: SET_AUTH.RESET_LOGIN_STATE });
};

export default {
    login,
    removeDefaultPasswordModal,
    forgotPassword,
    resetPassword,
    resetPasswordState,
    resetLoginState,
};
