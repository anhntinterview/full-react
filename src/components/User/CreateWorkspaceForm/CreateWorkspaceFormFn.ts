// PACKAGES
import {
    UseFormTrigger,
    FieldValues,
    UseFormGetValues,
    UseFormSetValue,
    UseFormClearErrors,
    DeepMap,
    FieldError,
} from 'react-hook-form';
// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';
// TYPES
import {MemberType} from 'types/CreateWorkspace.type';

export function handleChangeWorkspaceName(
    setValue: UseFormSetValue<FieldValues>,
    trigger: UseFormTrigger<FieldValues>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue('workspace', event.target.value);
        trigger('workspace');
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
        if (
            !targetEmail ||
            listMember.find(
                (i) =>
                    i.email.toLocaleLowerCase() ===
                    targetEmail.toLocaleLowerCase()
            )
        )
            return false;
        return true;
    };
};

export const handleRemoveMember = (
    target: string,
    listMember: MemberType[],
    setListMember: React.Dispatch<React.SetStateAction<MemberType[]>>
) => {
    return () => {
        const index = listMember.findIndex(
            (i) => i.email.toLocaleLowerCase() === target.toLocaleLowerCase()
        );
        if (index >= -1) {
            const temp = [...listMember];
            temp.splice(index, 1);
            setListMember(temp);
        }
    };
};

export const handleAddMember = (
    trigger: UseFormTrigger<FieldValues>,
    getValues: UseFormGetValues<FieldValues>,
    listMember: MemberType[],
    setListMember: React.Dispatch<React.SetStateAction<MemberType[]>>,
    setValue: UseFormSetValue<FieldValues>
) => {
    return () => {
        trigger('email').then((res) => {
            const memberToAdd = getValues('email');
            if (!res) return;
            if (validateMember(memberToAdd, listMember)) {
                const tempVal = {email: memberToAdd, role: 'member'};
                setListMember(
                    listMember.length ? [...listMember, tempVal] : [tempVal]
                );
            }
            setValue('email', '');
        });
    };
};

export interface CreateWorkspaceFormProps {
    isLoading: boolean;
    status: string;
    apiErrorMsg: string | undefined;
    memberListMsg: string | undefined;
    setMemberListMsg: React.Dispatch<React.SetStateAction<string | undefined>>;
    apiSuccessMsg: string | undefined;
    setApiSuccessMsg: React.Dispatch<React.SetStateAction<string | undefined>>;
    onMoveToInviteMember: (workspaceName: string) => void;
    onSelectAvatar: (avatar: File) => void
}
