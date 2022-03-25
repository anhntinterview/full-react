import React from 'react';
import MasterPage from '../MasterPage';
import Lesson from 'components/Workspace/Lesson';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import RouteMasterPage from 'pages/RouteMasterPage';

interface WorkspaceTrashBinProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const LessonPage: React.FC<WorkspaceTrashBinProps> = ({
    setAuthStorage,
    barType,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <Lesson>
                <RouteMasterPage setAuthStorage={setAuthStorage} />
            </Lesson>
        </MasterPage>
    );
};

export default LessonPage;
