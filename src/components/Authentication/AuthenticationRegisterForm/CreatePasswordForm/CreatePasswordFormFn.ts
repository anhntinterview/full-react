// PACKAGE
import { RouteComponentProps } from 'react-router-dom';
import {
    DeepMap,
    FieldError,
    FieldValues,
    UseFormGetValues,
    UseFormSetValue,
    UseFormTrigger,
} from 'react-hook-form';
// MIDDLEWARE
import registerMiddleware from 'middleware/register.middleware';
// TYPES
import { AuthType } from 'types/Auth.type';
import {
    isLocalStorageAuth,
    isSessionStorageAuth,
} from 'utils/handleLocalStorage';
import { FORM_CONST } from 'constant/form.const';
import { RegisterAction } from '../../../../types/Register.type';
import React from 'react';

export interface CreatePasswordFormProps {
    storageUserInfo: AuthType;
    storageUserInfoSession: AuthType;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

export function handleNewPassword(
    setValue: UseFormSetValue<FieldValues>,
    errors: DeepMap<FieldValues, FieldError>,
    setApiError: React.Dispatch<React.SetStateAction<string | undefined>>,
    trigger: UseFormTrigger<FieldValues>,
    getValues: UseFormGetValues<FieldValues>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue('password', value);
        trigger('password');
        if (getValues('confirm_password')?.length > 0) {
            if (getValues('confirm_password') !== value) {
                setApiError(FORM_CONST.PASSWORD_NOT_MATCH);
            } else {
                setApiError(undefined);
            }
        }
    };
}

export function handleConfirmPassword(
    setValue: UseFormSetValue<FieldValues>,
    errors: DeepMap<FieldValues, FieldError>,
    setApiError: React.Dispatch<React.SetStateAction<string | undefined>>,
    trigger: UseFormTrigger<FieldValues>,
    getValues: UseFormGetValues<FieldValues>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue('confirm_password', value);
        trigger('confirm_password');
        setApiError(undefined);

        if (
            getValues('password') !== value &&
            Object.keys(errors).length === 0
        ) {
            setApiError(FORM_CONST.PASSWORD_NOT_MATCH);
        }
    };
}

export function onSubmit(
    getValues: UseFormGetValues<FieldValues>,
    temporary_access_token: string | undefined,
    dispatch: React.Dispatch<RegisterAction>
) {
    return () => {
        const password = getValues('password');
        const confirmPassword = getValues('confirm_password');
        if (password === confirmPassword && temporary_access_token) {
            registerMiddleware.createPassword(dispatch, {
                temporary_access_token,
                password,
            });
        }
    };
}

// HANDLE MODAL
export type agreeModalArgs = {
    path: string;
};

export function navigateToUpdateInformation(
    history: RouteComponentProps['history'],
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>
) {
    return () => {
        history.push('/information/update');
    };
}
