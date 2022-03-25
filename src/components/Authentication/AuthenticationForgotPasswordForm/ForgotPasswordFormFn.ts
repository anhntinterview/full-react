// PACKAGE
import {
    DeepMap,
    FieldError,
    FieldValues,
    UseFormGetValues,
    UseFormSetValue,
    UseFormTrigger,
} from 'react-hook-form';
import { RouteComponentProps } from 'react-router-dom';
// MIDDLEWARE
import authMiddleware from 'middleware/auth.middleware';

export interface ForgotPasswordFormProps {
    tokenParam?: string;
    emailParam?: string;
}

export function handleResetPasswordState(
    dispatch: React.Dispatch<any>,
    authDispatch: React.Dispatch<any>,
    history: RouteComponentProps['history']
) {
    return () => {
        authMiddleware.resetPasswordState(dispatch);
        authMiddleware.resetLoginState(authDispatch);
        history.push('/login');
    };
}

export function handleChangeEmail(
    setValue: UseFormSetValue<FieldValues>,
    trigger: UseFormTrigger<FieldValues>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue('email', value);
        trigger('email');
    };
}

export function handleChangePassword(
    setValue: UseFormSetValue<FieldValues>,
    trigger: UseFormTrigger<FieldValues>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue('password', value);
        trigger('password');
    };
}

export function handleChangeConfirmPassword(
    setValue: UseFormSetValue<FieldValues>,
    trigger: UseFormTrigger<FieldValues>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue('confirmPassword', value);
        trigger('confirmPassword');
    };
}

export function onForgotSubmit(
    getValues: UseFormGetValues<FieldValues>,
    dispatch: React.Dispatch<any>
) {
    return () => {
        const inputEmail = getValues('email');
        if (inputEmail) {
            authMiddleware.forgotPassword(dispatch, {
                email: inputEmail.trim(),
            });
        }
    };
}

export function onResetSubmit(
    getValues: UseFormGetValues<FieldValues>,
    tokenParam: string | undefined,
    emailParam: string | undefined,
    dispatch: React.Dispatch<any>
) {
    return () => {
        const inputConfirmPassword = getValues('confirmPassword');
        if (inputConfirmPassword && tokenParam && emailParam) {
            authMiddleware.resetPassword(dispatch, {
                email: emailParam,
                code: tokenParam,
                password: inputConfirmPassword,
            });
        }
    };
}

// HANDLE MODAL:
export function handleModalResetAgree(
    path: string,
    history: RouteComponentProps['history']
) {
    return () => {
        history.push(path);
    };
}
