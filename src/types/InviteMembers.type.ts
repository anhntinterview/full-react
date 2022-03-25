import { NormalResponseError, ValidateResponseErrors } from './Common.type';

export interface InviteMembersState {
    isLoading: boolean;
    result:
        | {
              status: number;
          }
        | undefined;
    params: string;
    status: string;
    err: NormalResponseError | undefined;
    valErr: ValidateResponseErrors | undefined;
}
export interface InviteMembersAction extends InviteMembersState {
    type: string;
}

export type InviteMembersAgsType = {
    members: Array<InviteMemberBodyType>;
    workspaceId: number;
};

export type InviteMembersBodyType = {
    members: Array<InviteMemberBodyType>;
};

export type InviteMemberBodyType = {
    id?: number | undefined;
    email: string;
    role: string | undefined;
    message: string;
};
