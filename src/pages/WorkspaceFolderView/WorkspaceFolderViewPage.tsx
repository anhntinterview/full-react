import React from 'react';
import WorkspaceGoogleDriveView from 'components/Workspace/WorkspaceGoogleDriveView';
import MasterPage from '../MasterPage';

export interface WorkspaceGoogleDriveViewProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkspaceGoogleDriveViewPage: React.FC<WorkspaceGoogleDriveViewProps> = ({
    setAuthStorage,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <WorkspaceGoogleDriveView setAuthStorage={setAuthStorage} />
        </MasterPage>
    );
};

export default WorkspaceGoogleDriveViewPage;
