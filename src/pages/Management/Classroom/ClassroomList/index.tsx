import React from 'react';
import MasterPage from 'pages/MasterPage/';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import ManagementMasterPage from '../../../RouteMasterPage';
import ListClassroom from 'components/Management/Classrooms/ClassroomList';

interface ClassroomManageProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClassroomManagementPage: React.FC<ClassroomManageProps> = ({
    setAuthStorage,
    barType,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <ManagementMasterPage setAuthStorage={setAuthStorage}>
                <ListClassroom />
            </ManagementMasterPage>
        </MasterPage>
    );
};

export default ClassroomManagementPage;
