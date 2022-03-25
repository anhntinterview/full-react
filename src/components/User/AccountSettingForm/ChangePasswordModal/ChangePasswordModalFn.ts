import {DeepMap, FieldError, FieldValues, UseFormSetValue, UseFormTrigger} from "react-hook-form";
import React from "react";
import userMiddleware from "middleware/user.middleware";
import {UseFormGetValues} from "react-hook-form/dist/types/form";
import {FORM_CONST} from "constant/form.const";
import {TFunction} from "react-i18next";

export function handleCurrentPasswordChange(
    setValue: UseFormSetValue<FieldValues>,
    errors: DeepMap<FieldValues, FieldError>,
    trigger: UseFormTrigger<FieldValues>,
    setApiError: React.Dispatch<React.SetStateAction<string | undefined>>,
) {
    return handleInputChange(setValue, errors, trigger, 'current_password', setApiError);
}

export function handleNewPasswordChange(
    setValue: UseFormSetValue<FieldValues>,
    errors: DeepMap<FieldValues, FieldError>,
    trigger: UseFormTrigger<FieldValues>,
    setApiError: React.Dispatch<React.SetStateAction<string | undefined>>,
) {
    return handleInputChange(setValue, errors, trigger, 'new_password', setApiError);
}

export function handleConfirmPasswordChange(
    setValue: UseFormSetValue<FieldValues>,
    errors: DeepMap<FieldValues, FieldError>,
    trigger: UseFormTrigger<FieldValues>,
    getValues: UseFormGetValues<FieldValues>,
    setApiError: React.Dispatch<React.SetStateAction<string | undefined>>,
    translator: TFunction,
) {
    return handleInputChange(setValue, errors, trigger, 'confirm_password', setApiError, getValues, translator);
}

function handleInputChange(
    setValue: UseFormSetValue<FieldValues>,
    errors: DeepMap<FieldValues, FieldError>,
    trigger: UseFormTrigger<FieldValues>,
    name: string,
    setApiError: React.Dispatch<React.SetStateAction<string | undefined>>,
    getValues?: UseFormGetValues<FieldValues>,
    translator?: TFunction,
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setValue(name, value);
        trigger(name);
        setApiError(undefined);
        
        if (name === 'confirm_password' && getValues && translator) {
            if (getValues('new_password') !== value) {
                setApiError(translator('ACCOUNT_SETTING.CHANGE_PASSWORD_MODAL.CONFIRM_PASSWORD_NOT_MATCH'));
            }
        }
    };
}

export function onSubmit(
    oldPassword: string | undefined,
    newPassword: string | undefined,
    confirmPassword: string | undefined,
    dispatch: React.Dispatch<any>
) {
    return () => {
        if (oldPassword && newPassword && newPassword === confirmPassword) {
            userMiddleware.updatePassword(dispatch, {
                old_password: oldPassword,
                new_password: newPassword,
            });
        }
    };
}
