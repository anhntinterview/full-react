import React from 'react';
import MasterPage from '../MasterPage';
import { NavigationProps } from 'components/MasterPage/LeftNavigation/LeftNavigation';
import CoursesList from 'components/Workspace/CoursesList';
import RouteMasterPage from 'pages/RouteMasterPage';

interface CoursesPageProps {
    barType?: NavigationProps;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ setAuthStorage }) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <CoursesList>
                <RouteMasterPage setAuthStorage={setAuthStorage} />
            </CoursesList>
        </MasterPage>
    );
};

export default CoursesPage;
