import React from 'react';
import MasterPage from '../MasterPage';
import TrashBin from 'components/Workspace/TrashBin';
import H5PProvider from 'contexts/H5P/H5PProvider';
import RouteMasterPage from 'pages/RouteMasterPage';

interface WorkspaceTrashBinProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkspaceTrashBin: React.FC<WorkspaceTrashBinProps> = ({
    setAuthStorage,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <H5PProvider>
                <TrashBin>
                    <RouteMasterPage setAuthStorage={setAuthStorage} />
                </TrashBin>
            </H5PProvider>
        </MasterPage>
    );
};

export default WorkspaceTrashBin;
