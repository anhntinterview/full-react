import * as React from 'react';
// COMPONENTS
import MasterPage from '../MasterPage';
// PROVIDER
import AdminViewDetaiLessonCourse from 'components/Workspace/Admin/components/AdminViewDetailLesson';
import WorkspaceAdminProvider from 'contexts/Workspace/WorkspaceAdminProvider';
import { Redirect } from 'react-router';

export interface UserAccountSettingPageProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    role: string;
}

const DetailLessonPage: React.FC<UserAccountSettingPageProps> = ({
    setAuthStorage,
    role,
}) => {
    return role === 'admin' ? (
        <MasterPage setAuthStorage={setAuthStorage}>
            <WorkspaceAdminProvider>
                <AdminViewDetaiLessonCourse />
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

export default DetailLessonPage;
