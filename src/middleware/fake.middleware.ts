// ACTION
import { SET_UPDATE_PASSWORD } from 'actions/password.action';
import {
    SET_CREATE_WORKSPACE,
    SET_GET_CURRENT_USER_WORKSPACE,
    SET_INVITE_MEMBERS,
} from 'actions/workspace.action';
// SERVICE
import { UserService, WorkspaceService } from 'services';
import { FakeService } from 'services';
// TYPE
import { CreateWorkspaceArgsType } from 'types/CreateWorkspace.type';
import { GetListOfWorkspaceBodyType } from 'types/GetListOfWorkspace.type';
import { UpdatePasswordArgsType } from 'types/UpdatePassword.type';

const fakeCreateWorkspace = (
    dispatch: React.Dispatch<any>,
    args: CreateWorkspaceArgsType
) => {
    dispatch({ type: SET_CREATE_WORKSPACE.REQ_CREATE_WORKSPACE });
    try {
        FakeService.fakeCreateWorkspace(args)
            .then((result) => {
                console.log(`result workspace: `, result);

                dispatch({
                    type: SET_CREATE_WORKSPACE.REQ_CREATE_WORKSPACE_SUCCESS,
                    result,
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                dispatch({
                    type: SET_CREATE_WORKSPACE.REQ_CREATE_WORKSPACE_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_CREATE_WORKSPACE.REQ_CREATE_WORKSPACE_FAIL,
            err: err.toJSON().message,
        });
    }
};

const fakeGetListOfWorkspace = (
    dispatch: React.Dispatch<any>,
    args: GetListOfWorkspaceBodyType
) => {
    dispatch({
        type: SET_GET_CURRENT_USER_WORKSPACE.REQ_GET_CURRENT_USER_WORKSPACE,
    });
    try {
        FakeService.fakeGetListOfWorkspace(args)
            .then((result) => {
                dispatch({
                    type:
                        SET_GET_CURRENT_USER_WORKSPACE.REQ_GET_CURRENT_USER_WORKSPACE_SUCCESS,
                    result,
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                dispatch({
                    type:
                        SET_GET_CURRENT_USER_WORKSPACE.REQ_GET_CURRENT_USER_WORKSPACE_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type:
                SET_GET_CURRENT_USER_WORKSPACE.REQ_GET_CURRENT_USER_WORKSPACE_FAIL,
            err: err.toJSON().message,
        });
    }
};

const fakeUpdatePassword = (
    dispatch: React.Dispatch<any>,
    args: UpdatePasswordArgsType
) => {
    dispatch({ type: SET_UPDATE_PASSWORD.REQ_UPDATE_PASSWORD });
    try {
        FakeService.fakeUpdatePassword(args)
            .then((result) => {
                dispatch({
                    type: SET_UPDATE_PASSWORD.REQ_UPDATE_PASSWORD_SUCCESS,
                    result,
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                dispatch({
                    type: SET_UPDATE_PASSWORD.REQ_UPDATE_PASSWORD_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_UPDATE_PASSWORD.REQ_UPDATE_PASSWORD_FAIL,
            err: err.toJSON().message,
        });
    }
};

export default {
    fakeUpdatePassword,
    fakeCreateWorkspace,
    fakeGetListOfWorkspace,
};
