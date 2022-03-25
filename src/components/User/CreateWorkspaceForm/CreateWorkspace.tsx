import * as React from 'react';
// PACKAGE
import { useHistory } from 'react-router-dom';
// COMPONENTS
import CreateWorkspaceForm from './CreateWorkspaceForm';
// CONTEXT
import {
    CreateWorkspaceContext,
    GetListOfWorkspaceContext,
} from 'contexts/Workspace/WorkspaceContext';
// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';
// LOGIC
import { CreateWorkspaceProps } from './CreateWorkspaceFn';
// CONTEXT
import { AuthContext } from 'contexts/Auth/AuthContext';
// UTILS
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { handleLogout } from 'utils/handleLogout';
import InviteToWorkspaceForm from './InviteToWorkspaceForm';
import { useState } from 'react';
import { AUTH_CONST } from 'constant/auth.const';

const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({
    setAuthStorage,
    changeTab,
    tab,
}) => {
    // const history = useHistory();
    const [apiSuccessMsg, setApiSuccessMsg] = React.useState<string>();
    const [memberListMsg, setMemberListMsg] = React.useState<string>();
    const [apiErrorMsg, setApiErrorMsg] = React.useState<string>();
    const [avatar, setAvatar] = useState<File>();

    const { createWorkspaceState, dispatch } = React.useContext(
        CreateWorkspaceContext
    );
    const { err, isLoading, status } = createWorkspaceState;
    const { access_token } = getLocalStorageAuthData();

    const {
        getListOfWorkspaceState,
        dispatch: dispatchList,
    } = React.useContext(GetListOfWorkspaceContext);

    const { err: listWorkspaceErr } = getListOfWorkspaceState;

    const authCtx = React.useContext(AuthContext);
    const authDispatch = authCtx.dispatch;
    const [name, setName] = useState<string>();
    const history = useHistory();

    React.useEffect(() => {
        if (err) {
            setApiErrorMsg(err.error.description);
        }
    }, [err]);

    React.useEffect(() => {
        if (listWorkspaceErr?.error?.name === AUTH_CONST.TOKEN_EXPIRED) {
            handleLogout(authDispatch, setAuthStorage);
        }
    }, [listWorkspaceErr]);

    React.useEffect(() => {
        if (access_token) {
            workspaceMiddleware.getListOfWorkspace(dispatchList);
        }
    }, []);

    React.useEffect(() => {
        if (status === 'done' && !isLoading) {
            history.push('/');
        }
    }, [status, isLoading]);

    return (
        <>
            {tab === 0 ? (
                <CreateWorkspaceForm
                    isLoading={isLoading}
                    status={status}
                    apiErrorMsg={apiErrorMsg}
                    memberListMsg={memberListMsg}
                    setMemberListMsg={setMemberListMsg}
                    apiSuccessMsg={apiSuccessMsg}
                    setApiSuccessMsg={setApiSuccessMsg}
                    onMoveToInviteMember={(workspaceName) => {
                        setName(workspaceName);
                        changeTab(1);
                    }}
                    onSelectAvatar={setAvatar}
                />
            ) : (
                <InviteToWorkspaceForm
                    isLoading={isLoading}
                    setApiErrorMsg={setApiErrorMsg}
                    access_token={access_token}
                    dispatch={dispatch}
                    setApiSuccessMsg={setApiSuccessMsg}
                    workspaceName={name}
                    avatar={avatar}
                />
            )}
        </>
    );
};

export default CreateWorkspace;
