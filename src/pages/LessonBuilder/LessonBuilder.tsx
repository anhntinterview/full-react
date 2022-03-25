import React from 'react';
import LessonBuilder from 'components/Workspace/LessonBuilder';
import MasterPage from '../MasterPage';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import RouteMasterPage from 'pages/RouteMasterPage';

interface LessonBuilderProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const LessonBuilderPage: React.FC<LessonBuilderProps> = ({
    setAuthStorage,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <LessonBuilder>
                <RouteMasterPage
                    fetchtingRouteId={['lessonId']}
                    setAuthStorage={setAuthStorage}
                />
            </LessonBuilder>
        </MasterPage>
    );
};

export default LessonBuilderPage;
