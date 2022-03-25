// PACKAGE
import { RouteComponentProps } from 'react-router-dom';
// TYPE
import { AuthType } from 'types/Auth.type';

export function handleChangeWorkspace(
    setWorkspace: React.Dispatch<React.SetStateAction<string | undefined>>,
    access_token: string | undefined,
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (access_token) {
            setWorkspace(value);
        }
    };
}
export function handleChangePhone(
    setPhone: React.Dispatch<React.SetStateAction<string | undefined>>,
    access_token: string | undefined
) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        if (access_token) {
            setPhone(value);
        }
    };
}

// HANDLE MODAL
export function handleModalAgree(
    path: string,
    history: RouteComponentProps['history']
) {
    return () => {
        history.push(path);
    };
}

export interface MyWorkspaceProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    storageUserInfo: AuthType;
}