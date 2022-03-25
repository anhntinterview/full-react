import * as React from 'react';

import MasterPage from '../MasterPage';
import Admin from 'components/Workspace/Admin';
import WorkspaceAdminProvider from 'contexts/Workspace/WorkspaceAdminProvider';
import { Redirect } from 'react-router';
import RouteMasterPage from 'pages/RouteMasterPage';

interface WorkspaceTrashBinProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    role: string;
}

const AdminPage: React.FC<WorkspaceTrashBinProps> = ({
    setAuthStorage,
    role,
}) => {
    return role === 'admin' ? (
        <WorkspaceAdminProvider>
            <MasterPage setAuthStorage={setAuthStorage}>
                <Admin>
                    <RouteMasterPage setAuthStorage={setAuthStorage} />
                </Admin>
            </MasterPage>
        </WorkspaceAdminProvider>
    ) : (
        <Redirect
            to={{
                pathname: '/',
            }}
        />
    );
};

export default AdminPage;
