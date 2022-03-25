import React from 'react';
import MasterPage from 'pages/MasterPage/';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import ManagementMasterPage from '../../../RouteMasterPage';
import ClassroomDetail from 'components/Management/Classrooms/ClassroomDetail';

interface GroupsDetailProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClassroomDetailPage: React.FC<GroupsDetailProps> = ({
    setAuthStorage,
    barType,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <ManagementMasterPage setAuthStorage={setAuthStorage}>
                <ClassroomDetail/>
            </ManagementMasterPage>
        </MasterPage>
    );
};

export default ClassroomDetailPage;
