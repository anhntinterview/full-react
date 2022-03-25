import * as React from 'react';
// ACTIONS
import { SET_AUTH, SET_REGISTER } from 'actions/auth.action';
// SERVICES
import { RegisterService } from 'services';
// CONSTANT
import { AUTH_CONST } from 'constant/auth.const';
// TYPES
import {
    RegisterAction,
    RegisterCreateTemporaryUserBodyType,
    RegisterState,
    RegisterVerifyEmailBodyType,
} from 'types/Register.type';
import { CreatePasswordArgsType } from 'types/CreatePassword.type';
import { AuthAction } from '../types/Auth.type';

const resetState = (dispatch: React.Dispatch<RegisterAction>) => {
    // @ts-ignore
    dispatch({ type: SET_REGISTER.REQ_RESET_RESULT });
};

const createTemporaryUser = (
    dispatch: React.Dispatch<RegisterAction>,
    body: RegisterCreateTemporaryUserBodyType
) => {
    // @ts-ignore
    dispatch({ type: SET_REGISTER.REQ_REGISTER });
    try {
        RegisterService.createTemporaryUser(body)
            .then((result) => {
                console.log(result, 'result');

                if (result) {
                    // const rs = result.json();
                    // @ts-ignore
                    dispatch({
                        type: SET_REGISTER.REQ_REGISTER_TEMPORARY_USER_SUCCESS,
                        registerResult: {
                            response: 204,
                            email: body.email,
                        },
                    });
                    // result.then((r) => {
                    //     if (r.error) {
                    //         // @ts-ignore
                    //         dispatch({
                    //             type:
                    //             SET_REGISTER.REQ_REGISTER_TEMPORARY_USER_FAIL,
                    //             err: r,
                    //         });
                    //     }
                    // });
                }
            })
            .catch((error) => {
                console.log('Error:', error);
                // @ts-ignore
                dispatch({
                    type: SET_REGISTER.REQ_REGISTER_TEMPORARY_USER_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        // @ts-ignore
        dispatch({
            type: SET_REGISTER.REQ_REGISTER_TEMPORARY_USER_FAIL,
            err: err.toJSON().message,
        });
    }
};

const verifyEmail = (
    dispatch: React.Dispatch<RegisterAction>,
    authDispatch: React.Dispatch<AuthAction>,
    body: RegisterVerifyEmailBodyType
) => {
    // @ts-ignore
    dispatch({ type: SET_REGISTER.REQ_REGISTER });
    try {
        RegisterService.verifyEmail(body)
            .then((result) => {
                if (result.error) {
                    // @ts-ignore
                    dispatch({
                        type: SET_REGISTER.REQ_REGISTER_VERIFY_EMAIL_FAIL,
                        err: result,
                    });
                }
                // @ts-ignore
                dispatch({
                    type: SET_REGISTER.REQ_REGISTER_VERIFY_EMAIL_SUCCESS,
                    verifyEmailResult: result,
                });
                // @ts-ignore
                authDispatch({
                    type: SET_AUTH.LOGIN_SUCCESS,
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                // @ts-ignore
                dispatch({
                    type: SET_REGISTER.REQ_REGISTER_VERIFY_EMAIL_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        // @ts-ignore
        dispatch({
            type: SET_REGISTER.REQ_REGISTER_TEMPORARY_USER_FAIL,
            err: err.toJSON().message,
        });
    }
};

const createPassword = (
    dispatch: React.Dispatch<RegisterAction>,
    args: CreatePasswordArgsType
) => {
    // @ts-ignore
    dispatch({ type: SET_REGISTER.REQ_REGISTER });
    RegisterService.createPassword(args)
        .then((result) => {
            // @ts-ignore
            dispatch({
                type: SET_REGISTER.REQ_REGISTER_NEW_PASSWORD_SUCCESS,
                createNewPasswordResult: result.data,
            });
        })
        .catch((error) => {
            console.error('Error:', error);
            // @ts-ignore
            dispatch({
                type: SET_REGISTER.REQ_REGISTER_NEW_PASSWORD_FAIL,
                err: error,
            });
        });
};

const clearRegisterErrorState = (dispatch: React.Dispatch<RegisterAction>) => {
    // @ts-ignore
    dispatch({
        type: SET_REGISTER.REQ_CLEAR_ERROR,
    });
};

export default {
    resetState,
    createTemporaryUser,
    verifyEmail,
    createPassword,
    clearRegisterErrorState,
};
