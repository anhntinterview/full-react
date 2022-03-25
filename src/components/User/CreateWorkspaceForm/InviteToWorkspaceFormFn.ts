// PACKAGES
import {DeepMap, FieldError, FieldValues, UseFormGetValues, UseFormSetValue, UseFormTrigger,} from 'react-hook-form';
// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';
// TYPES
import {CreateWorkspaceAction, MemberType} from 'types/CreateWorkspace.type';
import React from "react";

export function handleEmail(
    setValue: UseFormSetValue<FieldValues>,
    trigger: UseFormTrigger<FieldValues>,
    index: number,
    onChange: (email: string, index: number) => void
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(`${index}`, event.target.value);
        trigger(`${index}`);
        onChange(event.target.value, index);
    };
}

export function inviteMember(
    setInvitedMembers: React.Dispatch<React.SetStateAction<boolean | undefined>>
) {
    return (e: React.SyntheticEvent) => {
        e.preventDefault();
        setInvitedMembers(true);
    };
}

export function handleChangeEmail(
    setValue: UseFormSetValue<FieldValues>,
    trigger: UseFormTrigger<FieldValues>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue('email', event.target.value);
        trigger('email');
    };
}

export const toggleCreateWorkspace = (
    setIsCreate: React.Dispatch<React.SetStateAction<boolean>>,
    isCreate: boolean,
    setApiErrorMsg: React.Dispatch<React.SetStateAction<string | undefined>>,
    setApiSuccessMsg: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
    return () => {
        setApiErrorMsg(undefined);
        setApiSuccessMsg(undefined);
        setIsCreate(!isCreate);
    };
};

export const handleCancelCreateWorkspace = (
    reset: (
        values?:
            | {
            [x: string]: any;
        }
            | undefined,
        keepStateOptions?:
            | Partial<{
            keepErrors: boolean;
            keepDirty: boolean;
            keepValues: boolean;
            keepDefaultValues: boolean;
            keepIsSubmitted: boolean;
            keepTouched: boolean;
            keepIsValid: boolean;
            keepSubmitCount: boolean;
        }>
            | undefined
    ) => void,
    clearErrors: (
        name?:
            | string
            | `${string}.${string}`
            | `${string}.${number}`
            | (string | `${string}.${string}` | `${string}.${number}`)[]
            | undefined
    ) => void,
    setListMember: (value: React.SetStateAction<MemberType[]>) => void,
    toggleCreateWorkspace: (
        setIsCreate: React.Dispatch<React.SetStateAction<boolean>>,
        isCreate: boolean,
        setApiErrorMsg: React.Dispatch<React.SetStateAction<string | undefined>>,
        setApiSuccessMsg: React.Dispatch<React.SetStateAction<string | undefined>>
    ) => () => void,
    setIsCreate: React.Dispatch<React.SetStateAction<boolean>>,
    isCreate: boolean,
    setInvitedMembers: React.Dispatch<React.SetStateAction<boolean | undefined>>,
    setMemberListMsg: React.Dispatch<React.SetStateAction<string | undefined>>,
    setApiErrorMsg: React.Dispatch<React.SetStateAction<string | undefined>>,
    setApiSuccessMsg: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
    return () => {
        reset();
        setInvitedMembers(false);
        setMemberListMsg(undefined);
        clearErrors('workspace');
        setListMember([]);
        toggleCreateWorkspace(
            setIsCreate,
            isCreate,
            setApiErrorMsg,
            setApiSuccessMsg
        );
        setIsCreate(false);
    };
};

export const validateMember = (
    targetEmail: string,
    listMember: MemberType[]
) => {
    return () => {
        return !(!targetEmail ||
            listMember.find(
                (i) =>
                    i.email.toLocaleLowerCase() ===
                    targetEmail.toLocaleLowerCase()
            ));

    };
};

export const handleRemoveMember = (
    listMember: MemberType[],
    setListMember: React.Dispatch<React.SetStateAction<MemberType[]>>,
    index: number,
) => {
    return () => {
        const temp = [...listMember];
        temp.splice(index, 1);
        setListMember(temp);
    };
};

export const handleAddMember = (
    listMember: MemberType[],
    setListMember: React.Dispatch<React.SetStateAction<MemberType[]>>,
) => {
    return () => {
        const memberToAdd = '';
        const tempVal = {email: memberToAdd, role: 'member'};
        setListMember(
            listMember.length ? [...listMember, tempVal] : [tempVal]
        );
    };
};

export const handleUpdateMemberEmail = (
    email: string,
    listMember: MemberType[],
    setListMember: React.Dispatch<React.SetStateAction<MemberType[]>>,
    index: number,
) => {
    return () => {
        const memberToAdd = email;
        if (validateMember(memberToAdd, listMember)) {
            listMember[index] = {email: memberToAdd, role: 'member'};
            setListMember([...listMember]);
        }
    };
};


export const onSubmitForm = (
    listMember: MemberType[],
    setApiError: React.Dispatch<React.SetStateAction<string | undefined>>,
    access_token: string | undefined,
    dispatch: React.Dispatch<CreateWorkspaceAction>,
    setApiSuccessMsg: React.Dispatch<React.SetStateAction<string | undefined>>,
    workspaceName: string | undefined,
    avatar: File | undefined,
) => {
    return () => {
        if ( workspaceName) {
            let filteredArray = listMember.filter(item => !!item.email);
            workspaceMiddleware.createWorkspace(dispatch, {
                access_token: access_token,
                name: workspaceName,
                members: filteredArray,
                avatar: avatar
            });
            setApiError(undefined);
            setApiSuccessMsg(
                'Create Workspace and Invite Member successfully!'
            );
        }
    };
};

export interface InviteToWorkspaceFormProps {
    isLoading: boolean;
    setApiErrorMsg: React.Dispatch<React.SetStateAction<string | undefined>>;
    access_token: string | undefined;
    dispatch: React.Dispatch<any>;
    setApiSuccessMsg: React.Dispatch<React.SetStateAction<string | undefined>>;
    workspaceName: string | undefined;
    avatar: File | undefined;
}
