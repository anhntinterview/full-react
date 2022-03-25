import React, { useContext, useEffect, useState } from 'react';
// PACKAGE
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
// CONTEXT
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
// UTILS
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { handleLogout } from 'utils/handleLogout';
// MIDDLEWATE
import workspaceMiddleware from 'middleware/workspace.middleware';
import googleMiddleware from 'middleware/google.middleware';
// CONTEXT
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';
import { AuthContext } from 'contexts/Auth/AuthContext';
// LOGIC
import { WorkspaceDriveFormProps } from './WorkspaceDriveFormFn';
import {AUTH_CONST} from "constant/auth.const";

const WorkspaceDriveForm: React.FC<WorkspaceDriveFormProps> = ({
    setAuthStorage,
}) => {
    const [listMembers, setListMembers] = useState<
        { value: number; label: string }[]
    >([]);

    const { formState, control } = useForm();

    const params: { id: string } = useParams();
    const { getWorkspaceDetailState, dispatch: WorkspaceDispatch } = useContext(
        GetWorkspaceContext
    );
    const { dispatch: GoogleDispatch, googleState } = useContext(
        GoogleAPIAndServicesContext
    );
    const { members, err } = getWorkspaceDetailState;
    console.log(members);
    
    const authCtx = React.useContext(AuthContext);
    const authDispatch = authCtx.dispatch;

    useEffect(() => {
        if (err?.error?.name === AUTH_CONST.TOKEN_EXPIRED) {
            handleLogout(authDispatch, setAuthStorage);
        }
    }, [err]);

    useEffect(() => {
        const { access_token } = getLocalStorageAuthData();

        if (access_token && params.id) {
            workspaceMiddleware.getWorkspaceMembers(WorkspaceDispatch, {
                id: params.id,
            });
            googleMiddleware;
        }
    }, []);

    useEffect(() => {
        if (members.items && members.items.length) {
            const tempList = members.items.map((i) => ({
                value: i.id,
                label: i.name,
            }));
            setListMembers(tempList);
        }
    }, [members]);

    return (
        <form className="w-full h-full">
            <Controller
                control={control}
                name="sharedMembers"
                render={({ field: { onChange, value } }) => (
                    <Select options={listMembers} />
                )}
            />
        </form>
    );
};

export default WorkspaceDriveForm;
