import React from 'react';
import WorkspaceGoogleDriveView from 'components/Workspace/WorkspaceGoogleDriveView';
import MasterPage from '../MasterPage';
import WorkspaceDrive from 'components/Workspace/WorkspaceDrive';

export interface WorkspaceGoogleDriveViewProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkspaceDrivePage: React.FC<WorkspaceGoogleDriveViewProps> = ({
    setAuthStorage,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <WorkspaceDrive setAuthStorage={setAuthStorage} />
        </MasterPage>
    );
};

export default WorkspaceDrivePage;
