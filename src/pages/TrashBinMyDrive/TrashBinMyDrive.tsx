import React from 'react';
import MasterPage from '../MasterPage';
import TrashBinMyDrive from 'components/Workspace/TrashBin/TrashBinMyDrive';
import RouteMasterPage from 'pages/RouteMasterPage';

interface TrashBinMyDriveProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const TrashBinMyDrivePage: React.FC<TrashBinMyDriveProps> = ({
    setAuthStorage,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <TrashBinMyDrive>
                <RouteMasterPage setAuthStorage={setAuthStorage} />
            </TrashBinMyDrive>
        </MasterPage>
    );
};

export default TrashBinMyDrivePage;
