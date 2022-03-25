import React from 'react';
import MasterPage from 'pages/MasterPage/';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import ClassroomDetail from 'components/Management/Classrooms/ClassroomDetail';
import TeacherDetail from 'components/Management/Teacher/TechearDetail';
import ManagementMasterPage from 'pages/RouteMasterPage';

interface GroupsDetailProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const TeacherDetailPage: React.FC<GroupsDetailProps> = ({
    setAuthStorage,
    barType,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <ManagementMasterPage setAuthStorage={setAuthStorage}>
                <TeacherDetail />
            </ManagementMasterPage>
        </MasterPage>
    );
};

export default TeacherDetailPage;
