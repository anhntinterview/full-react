import { Dispatch, createContext } from 'react';
// STATES
import { initPasswordState } from 'state/Password/password.state';
// TYPES
import { UpdatePasswordState } from 'types/UpdatePassword.type';
import { ForgotPasswordState } from 'types/ForgotPassword.type';
import { ResetPasswordState } from 'types/ResetPassword.type';

export const PasswordContext = createContext<{
    passwordState: UpdatePasswordState &
        ForgotPasswordState &
        ResetPasswordState;
    dispatch: Dispatch<any>;
}>({
    passwordState: initPasswordState,
    dispatch: () => null,
});
