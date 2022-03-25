// COMPONENTS
import {
    DeepMap,
    FieldError,
    FieldValues,
    UseFormGetValues,
    UseFormSetValue,
    UseFormTrigger,
} from 'react-hook-form';
// TYPES
import {
    RegisterAction,
    RegisterCreateTemporaryUserBodyType,
} from 'types/Register.type';
// MIDDLEWARE
import registerMiddleware from 'middleware/register.middleware';
import React from 'react';

export interface RegisterFormProps {
    setEmailRegisted: React.Dispatch<React.SetStateAction<boolean>>;
    setEmailState: React.Dispatch<
        React.SetStateAction<RegisterCreateTemporaryUserBodyType | undefined>
    >;
    emailState: RegisterCreateTemporaryUserBodyType | undefined;
}

export function handleChangeEmail(
    setEmailState: React.Dispatch<
        React.SetStateAction<RegisterCreateTemporaryUserBodyType | undefined>
    >,
    errors: DeepMap<FieldValues, FieldError>,
    setApiError: React.Dispatch<React.SetStateAction<string | undefined>>,
    setValue: UseFormSetValue<FieldValues>,
    trigger: UseFormTrigger<FieldValues>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setEmailState({
            email: value.trim(),
            time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });
        setValue('email', value);
        trigger('email');
        setApiError(undefined);
    };
}

export function onSubmit(
    dispatch: React.Dispatch<RegisterAction>,
    emailState: RegisterCreateTemporaryUserBodyType | undefined,
    getValues: UseFormGetValues<FieldValues>
) {
    return () => {
        if (emailState) {
            const mail = getValues('email');
            const emailForm: RegisterCreateTemporaryUserBodyType = {
                email: mail,
            };
            registerMiddleware.createTemporaryUser(dispatch, emailForm);
        }
    };
}
