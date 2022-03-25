import React from 'react';
import MasterPage from 'pages/MasterPage/';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import ManagementMasterPage from 'pages/RouteMasterPage';
import StudentList from 'components/Management/Student/StudentList';

interface StudentListProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const StudentListPage: React.FC<StudentListProps> = ({
    setAuthStorage,
    barType,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <ManagementMasterPage setAuthStorage={setAuthStorage}>
                <StudentList />
            </ManagementMasterPage>
        </MasterPage>
    );
};

export default StudentListPage;
