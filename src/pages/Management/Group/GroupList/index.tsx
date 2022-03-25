import React from 'react';
import MasterPage from 'pages/MasterPage/';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import GroupsManagement from 'components/Management/Group/GroupList';
import ManagementMasterPage from '../../../RouteMasterPage';

interface WorkspaceTrashBinProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const GroupsManagementPage: React.FC<WorkspaceTrashBinProps> = ({
    setAuthStorage,
    barType,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <ManagementMasterPage setAuthStorage={setAuthStorage}>
                <GroupsManagement />
            </ManagementMasterPage>
        </MasterPage>
    );
};

export default GroupsManagementPage;
