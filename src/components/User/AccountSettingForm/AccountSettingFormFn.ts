import {
    DeepMap,
    FieldError,
    FieldValues,
    UseFormSetValue,
    UseFormTrigger,
} from 'react-hook-form';
import React from 'react';
import { UpdateUserArgsType } from '../../../types/User.type';
import userMiddleWare from '../../../middleware/user.middleware';
import { timezone } from 'constant/timezone.const';

export function handleFirstNameChange(
    setValue: UseFormSetValue<{
        first_name: string | undefined;
        last_name: string | undefined;
    }>,
    errors: DeepMap<FieldValues, FieldError>,
    trigger: UseFormTrigger<{
        first_name: string | undefined;
        last_name: string | undefined;
    }>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue('first_name', value);
        trigger('first_name');
    };
}

export function handleLastNameChange(
    setValue: UseFormSetValue<{
        first_name: string | undefined;
        last_name: string | undefined;
    }>,
    errors: DeepMap<FieldValues, FieldError>,
    trigger: UseFormTrigger<{
        first_name: string | undefined;
        last_name: string | undefined;
    }>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setValue('last_name', value);
        trigger('last_name');
    };
}

export function saveUserInfoChanges(
    userInfo: UpdateUserArgsType,
    dispatch: React.Dispatch<any>
) {
    return () => {
        userMiddleWare.updateUser(dispatch, userInfo);
    };
}

export const formatTimezone = (
    tz: string
): { label: string; value: string } | undefined => {
    const textTimeZone = timezone.find((i) => i.utc.includes(tz));
    if (textTimeZone) {
        return {
            label: textTimeZone.text,
            value: textTimeZone.utc[0],
        };
    }
    return undefined;
};
