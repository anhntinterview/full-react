// PACKAGE
import {
    FieldValues,
    UseFormGetValues,
    UseFormSetValue,
    UseFormTrigger,
} from 'react-hook-form';
// MIDDLEWARE
import authMiddleware from 'middleware/auth.middleware';
import React from 'react';
import { AUTH, HOST_URL } from 'constant/api.const';
import axios from 'axios';
import Cookies from 'js-cookie';

export interface LoginFormProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    defaultPassword?: boolean;
}

export function handleChangeEmail(
    setValue: UseFormSetValue<FieldValues>,
    trigger: UseFormTrigger<FieldValues>,
    setErrorMsg: React.Dispatch<React.SetStateAction<string | undefined>>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue('email', value.trim());
        trigger('email');
        setErrorMsg(undefined);
    };
}

export function handleChangePassword(
    setValue: UseFormSetValue<FieldValues>,
    trigger: UseFormTrigger<FieldValues>,
    setErrorMsg: React.Dispatch<React.SetStateAction<string | undefined>>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue('password', value);
        trigger('password');
        setErrorMsg(undefined);
    };
}

export function onSubmit(
    dispatch: React.Dispatch<any>,
    getValues: UseFormGetValues<FieldValues>
) {
    return () => {
        const email = getValues('email');
        const password = getValues('password');
        authMiddleware.login(dispatch, { email, password });
        // fetch(HOST_URL + '/users/me', {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     credentials: 'same-origin',
        //     // body: JSON.stringify({ email, password }),
        // });
        // axios.post(HOST_URL + AUTH.LOGIN, { email, password });
        // axios.get(HOST_URL + AUTH.LOGIN);
    };
}

export async function getUser() {
    // axios.get(HOST_URL + '/users/me', {
    //     withCredentials: true,
    // });
    console.log(
        Cookies.withAttributes({
            secure: true,
        }).get()
    );
}
