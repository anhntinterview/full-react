// PACKAGE
import { RouteComponentProps } from 'react-router-dom';
// TYPES
import { AuthType } from 'types/Auth.type';
// MIDDLEWARE
import userMiddleware from 'middleware/user.middleware';
// ACTIONS
import { SET_PASSWORD } from 'actions/password.action';
import { DeepMap, FieldError, FieldValues } from 'react-hook-form';

export interface UpdatePasswordFormProps {
    storageUserInfo: AuthType;
}

export function handleChangeOldPassword(
    setOldPassword: React.Dispatch<React.SetStateAction<string | undefined>>,
    setApiError: React.Dispatch<React.SetStateAction<string | undefined>>,
    errors: DeepMap<FieldValues, FieldError>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setOldPassword(value);
        if (Object.keys(errors).length > 0) {
            setApiError(undefined);
        }
    };
}

export function handleChangeNewPassword(
    setNewPassword: React.Dispatch<React.SetStateAction<string | undefined>>,
    setApiError: React.Dispatch<React.SetStateAction<string | undefined>>,
    errors: DeepMap<FieldValues, FieldError>
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setNewPassword(value);
        if (Object.keys(errors).length > 0) {
            setApiError(undefined);
        }
    };
}

export function onSubmit(
    oldPassword: string | undefined,
    newPassword: string | undefined,
    access_token: string | undefined,
    dispatch: React.Dispatch<any>
) {
    return () => {
        if (oldPassword && newPassword && access_token) {
            userMiddleware.updatePassword(dispatch, {
                access_token,
                old_password: oldPassword,
                new_password: newPassword,
            });
        }
    };
}

// HANDLE MODAL
export type agreeModalArgs = {
    path: string;
};
export function handleModalAgree(
    args: agreeModalArgs,
    dispatch: React.Dispatch<any>,
    history: RouteComponentProps['history']
) {
    return () => {
        dispatch({ type: SET_PASSWORD.REQ_SET_PASSWORD });
        return () => {
            history.push(args.path);
        };
    };
}
