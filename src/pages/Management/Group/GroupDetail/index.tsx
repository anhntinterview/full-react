import React from 'react';
import MasterPage from 'pages/MasterPage/';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import GroupsManagement from 'components/Management/Group/GroupList';
import ManagementMasterPage from '../../../RouteMasterPage';
import GroupDetail from 'components/Management/Group/GroupDetail';

interface GroupsDetailProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const GroupDetailPage: React.FC<GroupsDetailProps> = ({
    setAuthStorage,
    barType,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <ManagementMasterPage setAuthStorage={setAuthStorage}>
                <GroupDetail />
            </ManagementMasterPage>
        </MasterPage>
    );
};

export default GroupDetailPage;
