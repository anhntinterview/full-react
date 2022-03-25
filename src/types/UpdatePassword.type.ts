import { NormalResponseError, ValidateResponseErrors } from './Common.type';

export type UpdatePasswordBodyType = {
    old_password: string;
    new_password: string;
};

export type UpdatePasswordResponseType = {
    email: string;
    has_login_account: boolean;
    id: number;
    time_zone: 'UTC';
};

export interface UpdatePasswordState {
    isLoading: boolean;
    result: UpdatePasswordResponseType | undefined;
    params: string;
    status: string;
    err: NormalResponseError | undefined;
    valErr: ValidateResponseErrors | undefined;
}

export interface UpdatePasswordAction extends UpdatePasswordState {
    type: string;
}

export type UpdatePasswordArgsType = {
    old_password: string;
    new_password: string;
};
