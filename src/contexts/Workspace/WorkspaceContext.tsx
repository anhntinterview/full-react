import { Dispatch, createContext } from 'react';
// STATES
import {
    initCreateWorkspaceState,
    initInviteMembersStateState,
    initGetListOfWorkspaceState,
    initCurrentWorkspace,
    initCurrentPendingAdminWorkspace,
} from 'state/Workspace/workspace.state';
import { WorkspaceAdminPendingListResponse } from 'types/AdminWorkspace.type';
// TYPES
import {CreateWorkspaceAction, CreateWorkspaceState} from 'types/CreateWorkspace.type';
import {
    GetListOfWorkspaceState,
    WorkspaceDetailState,
} from 'types/GetListOfWorkspace.type';
import { InviteMembersState } from 'types/InviteMembers.type';

export const CreateWorkspaceContext = createContext<{
    createWorkspaceState: CreateWorkspaceState;
    dispatch: Dispatch<CreateWorkspaceAction>;
}>({
    createWorkspaceState: initCreateWorkspaceState,
    dispatch: () => null,
});

export const InviteMemberWorkspaceContext = createContext<{
    inviteMemberWorkspaceState: InviteMembersState;
    dispatch: Dispatch<any>;
}>({
    inviteMemberWorkspaceState: initInviteMembersStateState,
    dispatch: () => null,
});

export const GetListOfWorkspaceContext = createContext<{
    getListOfWorkspaceState: GetListOfWorkspaceState;
    dispatch: Dispatch<any>;
}>({
    getListOfWorkspaceState: initGetListOfWorkspaceState,
    dispatch: () => null,
});

export const GetWorkspaceContext = createContext<{
    getWorkspaceDetailState: WorkspaceDetailState;
    dispatch: Dispatch<any>;
}>({
    getWorkspaceDetailState: initCurrentWorkspace,
    dispatch: () => null,
});

export const GetWorkspaceAdminContext = createContext<{
    getWorkspaceAdminState: WorkspaceAdminPendingListResponse;
    dispatch: Dispatch<any>;
}>({
    getWorkspaceAdminState: initCurrentPendingAdminWorkspace,
    dispatch: () => null,
});
