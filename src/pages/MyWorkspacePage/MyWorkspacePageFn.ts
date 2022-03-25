// PACKAGE
import { RouteComponentProps } from 'react-router-dom';
// MIDDLEWARE
import authMiddleware from 'middleware/auth.middleware';
import { SET_AUTH } from 'actions/auth.action';
// TYPES
import { AuthType } from 'types/Auth.type';

export interface CreateWorkspacePageProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    storageUserInfo: AuthType;
}

export function handleModalAgree(
    path: string,
    dispatch: React.Dispatch<any>,
    history: RouteComponentProps['history']
) {
    return () => {
        authMiddleware.removeDefaultPasswordModal(dispatch);
        history.push(path);
        dispatch({
            type: SET_AUTH.LOGIN_WITH_DEFAULT_PASSWORD,
            result: false,
        });
    };
}

export function handleModalDismiss(dispatch: React.Dispatch<any>) {
    return () => {
        authMiddleware.removeDefaultPasswordModal(dispatch);
        dispatch({
            type: SET_AUTH.LOGIN_WITH_DEFAULT_PASSWORD,
            result: false,
        });
    };
}
