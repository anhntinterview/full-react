// TYPES
import {
    DeepMap,
    FieldError,
    FieldValues,
    UseFormClearErrors,
    UseFormGetValues,
    UseFormRegister,
    UseFormReset,
    UseFormSetValue,
    UseFormTrigger,
    UseFormUnregister,
} from 'react-hook-form';

import { AuthType } from 'types/Auth.type';
import {
    InviteMembersAgsType,
    InviteMemberBodyType,
} from 'types/InviteMembers.type';
// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';
// UTILS
import { getCurrentEmail } from 'utils/handleLocalStorage';
export interface InviteWorkspaceFormProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    storageUserInfo: AuthType;
}

export function handleSelectedWorkspace(
    setValue: UseFormSetValue<FieldValues>,
    trigger: UseFormTrigger<FieldValues>
) {
    return (e: React.FormEvent<HTMLSelectElement>) => {
        const { value } = e.currentTarget;
        setValue('workspaceId', value);
        trigger('workspaceId');
    };
}

export function handleSelectedRole(
    roleId: number,
    setWorkspace: (
        value: React.SetStateAction<InviteMembersAgsType | undefined>
    ) => void,
    setValue: UseFormSetValue<FieldValues>,
    trigger: UseFormTrigger<FieldValues>
) {
    return (e: React.FormEvent<HTMLSelectElement>) => {
        const { value } = e.currentTarget;
        setValue('role', value);
        setValue(`role-${roleId}`, value);
        trigger(`role-${roleId}`);
        let newWorkspace: InviteMembersAgsType;
        setWorkspace((prevState) => {
            if (prevState) {
                const updateMember = {
                    id: prevState?.members[roleId].id,
                    email: prevState?.members[roleId].email,
                    role: value,
                    error: '',
                };
                newWorkspace = {
                    access_token: prevState.access_token,
                    members: prevState.members.map((item, index) => {
                        if (index === roleId) {
                            item = updateMember;
                        }
                        return item;
                    }),
                    workspaceId: prevState?.workspaceId,
                };
            }
            return newWorkspace;
        });
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

export function memberListSubmit(
    setEmailError: (value: React.SetStateAction<string | undefined>) => void,
    setWorkspace: (
        value: React.SetStateAction<InviteMembersAgsType | undefined>
    ) => void,
    access_token: string | undefined,
    getValues: UseFormGetValues<FieldValues>,
    setValue: UseFormSetValue<FieldValues>
) {
    return () => {
        setEmailError('');
        let newWorkspace: InviteMembersAgsType;
        const email = getValues('email');
        const workspaceId = getValues('workspaceId');
        const role = getValues('role');

        // *** TODO
        // if (email) {
        //     setValue('email', '');
        // }
        if (access_token && email && workspaceId) {
            setWorkspace((prevState) => {
                if (prevState) {
                    let newMember: InviteMemberBodyType;
                    let tempArray: InviteMemberBodyType[];
                    const length = prevState.members.length;
                    const currentLastMember: InviteMemberBodyType =
                        prevState.members[length - 1];

                    const existEmail = prevState.members.filter(
                        (item) => item.email === email
                    );

                    if (existEmail.length > 0) {
                        setEmailError('Invitation email was existed');
                        return prevState;
                    }
                    if (email === getCurrentEmail()) {
                        setEmailError('Can not invite yourself');
                        return prevState;
                    }
                    if (currentLastMember.id) {
                        newMember = {
                            id: currentLastMember.id++,
                            email: email,
                            role: role,
                        };
                        tempArray = [...prevState.members, newMember];
                        newWorkspace = {
                            access_token,
                            members: tempArray,
                            workspaceId,
                        };
                    }
                } else {
                    if (email === getCurrentEmail()) {
                        setEmailError('Can not invite yourself');
                        return prevState;
                    }
                    newWorkspace = {
                        access_token,
                        members: [{ id: 1, email, role: '' }],
                        workspaceId,
                    };
                }
                return newWorkspace;
            });
        }
    };
}

export function onSubmit(
    workspace: InviteMembersAgsType | undefined,
    setWorkspace: React.Dispatch<
        React.SetStateAction<InviteMembersAgsType | undefined>
    >,
    inviteMemberWorkspaceDispatch: React.Dispatch<any>,
    reset: UseFormReset<FieldValues>,
    setSkipInvite: React.Dispatch<React.SetStateAction<boolean>>,
    skipInvite: boolean,
    errors: DeepMap<FieldValues, FieldError>,
    clearErrors: UseFormClearErrors<FieldValues>,
    unregister: UseFormUnregister<FieldValues>
) {
    return () => {
        if (workspace && workspace.members.length > 0) {
            clearErrors('email');
            unregister('email');
            workspaceMiddleware.inviteMembers(
                inviteMemberWorkspaceDispatch,
                workspace
            );
            reset({ email: '' });
            let newWorkspace: InviteMembersAgsType;
            setWorkspace(() => {
                return newWorkspace;
            });
            setSkipInvite(skipInvite);
        }
    };
}
