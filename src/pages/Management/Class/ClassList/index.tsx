import React from 'react';
import MasterPage from 'pages/MasterPage/';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import ManagementMasterPage from 'pages/RouteMasterPage';
import ClassList from 'components/Management/Class/ClassList';
import ManagePermissionWrapper from 'pages/Management/ManagePermissionWrapper';

interface ClassListProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClassListPage: React.FC<ClassListProps> = ({
    setAuthStorage,
    barType,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <ManagePermissionWrapper>
                <ClassList>
                    <ManagementMasterPage setAuthStorage={setAuthStorage} />
                </ClassList>
            </ManagePermissionWrapper>
        </MasterPage>
    );
};

export default ClassListPage;
