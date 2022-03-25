import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { oauth2Submit } from '../LeftNavigation/LeftMenuFN';

const Google: React.FC<{ hasWorkspaceDrive: boolean | string }> = ({
    hasWorkspaceDrive,
}) => {
    const userDataLocalStorage = getLocalStorageAuthData();
    const checkGoogleAuth = localStorage.getItem('google_auth');
    const { handleSubmit } = useForm();
    const param: { id: string; type?: string; folderId: string } = useParams();
    const {
        dispatch: workspaceDispatch,
        getWorkspaceDetailState,
    } = React.useContext(GetWorkspaceContext);
    const { members, isCreator, workspaceDriveId } = getWorkspaceDetailState;
    return (
        <div className="w-full h-auto text-white">
            {(!checkGoogleAuth && (
                <div
                    className="py-ooolab_p_4 px-ooolab_p_44 flex items-center"
                    style={{ backgroundColor: 'rgba(4, 187, 99)' }}
                >
                    <form
                        onSubmit={handleSubmit(
                            oauth2Submit(param, userDataLocalStorage.email)
                        )}
                        className="mr-ooolab_m_2"
                    >
                        <button
                            type="submit"
                            className="text-white py-2 px-4 mt-2 mb-2 border-white border rounded-md focus:outline-none"
                            style={{ backgroundColor: '#04BB63' }}
                        >
                            Connect to Google Drive
                        </button>
                    </form>
                    <p className="">
                        Your workspace is not connected to any drive yet, click
                        button "
                        <span className="font-bold">
                            Connect to Google Drive
                        </span>
                        " to connect.
                    </p>
                </div>
            )) ||
                null}
            {checkGoogleAuth &&
            !workspaceDriveId &&
            typeof hasWorkspaceDrive === 'boolean' &&
            !hasWorkspaceDrive ? (
                <div className="py-ooolab_p_4 px-ooolab_p_44 flex items-center bg-red-500">
                    {(isCreator && (
                        <>
                            <p>
                                Workspace drive is not found please, please
                                click here to proceed
                            </p>
                            <button className="text-white py-2 px-4 ml-ooolab_m_3 border-white border rounded-md focus:outline-none">
                                Set Workspace Drive
                            </button>
                        </>
                    )) ||
                        null}
                    {!isCreator && (
                        <p>
                            Workspace Drive not Found, please contact admin for
                            more information
                        </p>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default Google;
