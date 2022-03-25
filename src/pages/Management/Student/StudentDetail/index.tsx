import React from 'react';
import MasterPage from 'pages/MasterPage/';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import StudentDetail from 'components/Management/Student/StudentDetail';
import ManagementMasterPage from 'pages/RouteMasterPage';

interface GroupsDetailProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const StudentDetailPage: React.FC<GroupsDetailProps> = ({
    setAuthStorage,
    barType,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <ManagementMasterPage setAuthStorage={setAuthStorage}>
                <StudentDetail />
            </ManagementMasterPage>
        </MasterPage>
    );
};

export default StudentDetailPage;
