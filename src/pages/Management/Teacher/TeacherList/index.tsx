import React from 'react';
import MasterPage from 'pages/MasterPage/';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import ManagementMasterPage from 'pages/RouteMasterPage';
import TeacherList from 'components/Management/Teacher/TeacherList';

interface TeacherListProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const TeacherListPage: React.FC<TeacherListProps> = ({
    setAuthStorage,
    barType,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <ManagementMasterPage setAuthStorage={setAuthStorage}>
                <TeacherList />
            </ManagementMasterPage>
        </MasterPage>
    );
};

export default TeacherListPage;
