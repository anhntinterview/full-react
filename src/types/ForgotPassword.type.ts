import { NormalResponseError, ValidateResponseErrors } from './Common.type';

export interface ForgotPasswordState {
    isLoading: boolean;
    forgotPasswordResult: number | undefined;
    params: string;
    status: string;
    err: NormalResponseError | undefined;
    valErr: ValidateResponseErrors | undefined;
}

export interface ForgotPasswordAction extends ForgotPasswordState {
    type: string;
}

export type ForgotPasswordArgsType = {
    email: string;
};
