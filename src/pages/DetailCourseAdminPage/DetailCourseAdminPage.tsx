import * as React from 'react';
// COMPONENTS
import MasterPage from '../MasterPage';
// PROVIDER
import AdminViewDetailCourse from 'components/Workspace/Admin/components/AdminViewDetailCourse';
import WorkspaceAdminProvider from 'contexts/Workspace/WorkspaceAdminProvider';
import { Redirect } from 'react-router-dom';

export interface UserAccountSettingPageProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    role: string;
}

const DetailCourseAdminPage: React.FC<UserAccountSettingPageProps> = ({
    setAuthStorage,
    role,
}) => {
    return role === 'admin' ? (
        <MasterPage setAuthStorage={setAuthStorage}>
            <WorkspaceAdminProvider>
                <AdminViewDetailCourse />
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

export default DetailCourseAdminPage;
