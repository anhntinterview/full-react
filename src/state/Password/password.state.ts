import { UpdatePasswordState } from 'types/UpdatePassword.type';
import { ForgotPasswordState } from 'types/ForgotPassword.type';
import { ResetPasswordState } from 'types/ResetPassword.type';

export const initPasswordState: UpdatePasswordState &
    ForgotPasswordState &
    ResetPasswordState = {
    isLoading: false,
    resetPasswordResult: undefined,
    forgotPasswordResult: undefined,
    result: undefined,
    params: '',
    status: '',
    err: undefined,
    valErr: undefined,
};
