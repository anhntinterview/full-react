import React from 'react';
import { UpdateUserArgsType } from 'types/User.type';
import userMiddleWare from 'middleware/user.middleware';
import { FieldValues, UseFormSetValue, UseFormTrigger } from 'react-hook-form';

export interface UpdateInformationProps {}

export function onSubmit(
    userInfo: Partial<UpdateUserArgsType>,
    dispatch: React.Dispatch<any>
) {
    return () => {
        if (userInfo) {
            userMiddleWare.patchUpdateUser(dispatch, userInfo);
        }
    };
}

export function handleChangeFirstName(
    setValue: UseFormSetValue<FieldValues>,
    trigger: UseFormTrigger<FieldValues>,
    setApiError: React.Dispatch<React.SetStateAction<string | undefined>>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue('firstName', value.trim());
        trigger('firstName');
        setApiError(undefined);
    };
}
export function handleChangeLastName(
    setValue: UseFormSetValue<FieldValues>,
    trigger: UseFormTrigger<FieldValues>,
    setApiError: React.Dispatch<React.SetStateAction<string | undefined>>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue('lastName', value.trim());
        trigger('lastName');
        setApiError(undefined);
    };
}
