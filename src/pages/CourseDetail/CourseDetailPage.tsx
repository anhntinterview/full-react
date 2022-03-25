import React from 'react';
import MasterPage from '../MasterPage';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import CourseDetail from 'components/Workspace/CourseDetail';
import RouteMasterPage from 'pages/RouteMasterPage';

interface CourseDetailPageProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
    setAuthStorage,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <CourseDetail>
                <RouteMasterPage setAuthStorage={setAuthStorage} />
            </CourseDetail>
        </MasterPage>
    );
};

export default CourseDetailPage;
