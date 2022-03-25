// COMPONENTS
import {
    DeepMap,
    FieldError,
    FieldValues,
    UseFormGetValues,
    UseFormSetValue,
} from 'react-hook-form';
// TYPES
import {
    RegisterAction,
    RegisterCreateTemporaryUserBodyType,
    RegisterVerifyEmailBodyType,
} from 'types/Register.type';
// MIDDLEWARE
import registerMiddleware from 'middleware/register.middleware';
import {RegisterService} from 'services';
import React from "react";
import {AuthAction} from "../../../../types/Auth.type";

export interface SendCodeFromEmailProps {
    setEmailVerified: React.Dispatch<React.SetStateAction<boolean>>;
}

export function handleResend(
    setEmailState: React.Dispatch<React.SetStateAction<RegisterCreateTemporaryUserBodyType | undefined>>,
    setEmailRegisted: (value: React.SetStateAction<boolean>) => void,
    emailState: RegisterCreateTemporaryUserBodyType | undefined
) {
    return () => {
        emailState && RegisterService.createTemporaryUser(emailState);
    };
}

export function onSubmit(
    verifyCodeState: RegisterVerifyEmailBodyType | undefined,
    dispatch: React.Dispatch<RegisterAction>,
    authDispatch: React.Dispatch<AuthAction>
) {
    return () => {
        if (verifyCodeState) {
            registerMiddleware.clearRegisterErrorState(dispatch);
            registerMiddleware.verifyEmail(
                dispatch,
                authDispatch,
                verifyCodeState
            );
        }
    };
}