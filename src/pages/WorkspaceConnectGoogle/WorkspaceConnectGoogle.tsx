import WorkspaceConnectGoogle from 'components/Workspace/WorkspaceConnectGoogle';
import React from 'react';
import MasterPage from '../MasterPage';

interface WorkspaceConnectDriveProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkspaceConnectDrivePage: React.FC<WorkspaceConnectDriveProps> = ({
    setAuthStorage,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <WorkspaceConnectGoogle />
        </MasterPage>
    );
};

export default WorkspaceConnectDrivePage;
