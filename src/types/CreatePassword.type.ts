import { AuthType } from './Auth.type';
import { NormalResponseError, ValidateResponseErrors } from './Common.type';

export interface CreatePasswordState {
    isLoading: boolean;
    result: AuthType | undefined;
    params: string;
    status: string;
    err: NormalResponseError | undefined;
    valErr: ValidateResponseErrors | undefined;
}
export interface CreatePasswordAction extends CreatePasswordState {
    type: string;
}

export type CreatePasswordArgsType = {
    temporary_access_token: string;
    password: string;
};
