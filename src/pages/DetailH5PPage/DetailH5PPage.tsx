import * as React from 'react';
// COMPONENTS
import H5PPlayer from 'components/H5P/H5PPlayer';
import MasterPage from '../MasterPage';
// PROVIDER
import H5PProvider from 'contexts/H5P/H5PProvider';
import AdminViewDetailH5P from 'components/Workspace/Admin/components/AdminViewDetailH5P/AdminViewDetailH5P';
import WorkspaceAdminProvider from 'contexts/Workspace/WorkspaceAdminProvider';
import { Redirect } from 'react-router';

export interface UserAccountSettingPageProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    role: string;
}

const H5PPage: React.FC<UserAccountSettingPageProps> = ({
    setAuthStorage,
    role,
}) => {
    return role === 'admin' ? (
        <MasterPage setAuthStorage={setAuthStorage}>
            <WorkspaceAdminProvider>
                <H5PProvider>
                    <AdminViewDetailH5P />
                </H5PProvider>
            </WorkspaceAdminProvider>
        </MasterPage>
    ) : (
        <Redirect
            to={{
                pathname: '/',
            }}
        />
    );
};

export default H5PPage;
