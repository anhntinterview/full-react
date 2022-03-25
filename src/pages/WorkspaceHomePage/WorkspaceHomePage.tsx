import * as React from 'react';
// COMPONENTS
import WorkspaceHomeContent from 'components/Workspace/WorkspaceHomeContent';
import MasterPage from '../MasterPage';
import RouteMasterPage from 'pages/RouteMasterPage';
export interface WorkspaceHomePageProps {
    isAuthStorage: boolean;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkspaceHomePage: React.FC<WorkspaceHomePageProps> = ({
    setAuthStorage,
}) => {
    return (
        <>
            <MasterPage
                setAuthStorage={setAuthStorage}
            >
                <RouteMasterPage setAuthStorage={setAuthStorage}>
                    <WorkspaceHomeContent setAuthStorage={setAuthStorage} />
                </RouteMasterPage>
            </MasterPage>
        </>
    );
};

export default WorkspaceHomePage;
