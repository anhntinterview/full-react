import React from 'react';
import MasterPage from 'pages/MasterPage/';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import ManagementMasterPage from 'pages/RouteMasterPage';
import ClassList from 'components/Management/Class/ClassList';
import ClassDetail from 'components/Management/Class/ClassDetail';
import ManagePermissionWrapper from 'pages/Management/ManagePermissionWrapper';

interface ClassDetailProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClassDetailPage: React.FC<ClassDetailProps> = ({
    setAuthStorage,
    barType,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <ManagePermissionWrapper>
                <ClassDetail>
                    <ManagementMasterPage setAuthStorage={setAuthStorage} />
                </ClassDetail>
            </ManagePermissionWrapper>
        </MasterPage>
    );
};

export default ClassDetailPage;
