import { AuthType } from './Auth.type';
import { NormalResponseError, ValidateResponseErrors } from './Common.type';

export type RegisterCreateTemporaryUserBodyType = {
    email: string;
    time_zone?: string;
};

// TODO
export type RegisterCreateTemporaryUserResposeType = {
    response: number;
    email: string;
};
export type RegisterVerifyEmailResposeType = {
    temporary_access_token: string;
    email: string;
    has_login_account: boolean;
    id: number;
    time_zone: string;
};

export type RegisterVerifyEmailBodyType = {
    email: string | undefined;
    code: string | undefined;
};
export interface RegisterState {
    isLoading: boolean;
    registerResult:
        | {
              response: number | undefined;
              email: string | undefined;
          }
        | undefined;
    verifyEmailResult: AuthType | undefined;
    createNewPasswordResult: AuthType | undefined;
    params: string;
    status: string;
    err: NormalResponseError | undefined;
}

export interface RegisterAction extends RegisterState {
    type: string;
}
