import { NormalResponseError, ValidateResponseErrors } from './Common.type';
export interface ResetPasswordState {
    isLoading: boolean;
    resetPasswordResult: number | undefined;
    params: string;
    status: string;
    err: NormalResponseError | undefined;
    valErr: ValidateResponseErrors | undefined;
}

export interface ResetPasswordAction extends ResetPasswordState {
    type: string;
}

export type ResetPasswordArgsType = {
    email: string;
    code: string;
    password: string;
};
