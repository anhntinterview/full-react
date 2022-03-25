import WorkspaceSetting from 'components/Workspace/WorkspaceSetting';
import RouteMasterPage from 'pages/RouteMasterPage';
import React from 'react';
import MasterPage from '../MasterPage';

interface WorkspaceSettingProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkspaceSettingPage: React.FC<WorkspaceSettingProps> = ({
    setAuthStorage,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <WorkspaceSetting>
                <RouteMasterPage setAuthStorage={setAuthStorage} />
            </WorkspaceSetting>
        </MasterPage>
    );
};

export default WorkspaceSettingPage;
