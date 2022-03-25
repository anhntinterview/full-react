import {NormalResponseError, ValidateResponseErrors} from './Common.type';

export type CreateWorkspaceBodyType = {
    id: number | undefined;
    name: string | undefined;
    subdomain: null;
};

export interface CreateWorkspaceState {
    isLoading: boolean;
    result: CreateWorkspaceBodyType;
    params: string;
    status: string;
    err: NormalResponseError | undefined;
}

export interface CreateWorkspaceAction extends CreateWorkspaceState {
    type: string;
}

export interface MemberType {
    email: string;
    role: string;
}

export type CreateWorkspaceArgsType = {
    access_token: string;
    name: string;
    members: MemberType[];
    avatar?: File | string | undefined;
};
