import React from 'react';
// PACKAGE
import { Switch, useHistory, useParams } from 'react-router-dom';
// COMPONENT
import UserAccountSettingPage from 'pages/UserAccountSettingPage';
import LoginPage from 'pages/LoginPage';
import RegisterPage from 'pages/RegisterPage';
import CreatePasswordPage from 'pages/CreatePasswordPage';
import UpdatePasswordPage from 'pages/UpdatePasswordPage';
import ForgotPasswordPage from 'pages/ForgotPasswordPage';
import CreateWorkspacePage from 'pages/CreateWorkspacePage';
import WorkspaceHomepage from 'pages/WorkspaceHomePage';
import InviteWorkspaceMemberPage from 'pages/InviteWorkspaceMemberPage';
import H5PPage from 'pages/H5PPage';
import H5PPlayerPage from 'pages/H5PPlayerPage';
import EmbededPage from 'pages/EmbededPage';
import H5PBuilderPage from 'pages/H5PBuilderPage';
// TYPES
import { AuthLocalStorageType } from 'types/Auth.type';
// ROUTES
import PrivateRoute from './PrivateRoute';
import CommonRoute from './CommonRoute';
import NormalRoute from './NormalRoute';
import AuthRoute from './AuthRoute';
import GoogleResponsePage from 'pages/GoogleResponsePage';
import AuthTemporaryRoute from './AuthTemporaryRoute';
import WorkspaceTrashBin from 'pages/WorkspaceTrashBin';
import WorkspaceFolderViewPage from 'pages/WorkspaceFolderView';
import LessonBuilder from 'pages/LessonBuilder';
// CONSTANTS
import { BarType, NewBarType } from 'constant/setupBars.const';
import LessonPage from 'pages/LessonPage';
import AdminPage from 'pages/AdminPage';
import H5PPreviewPage from 'pages/H5PPreviewPage';
import UpdateInformationPage from 'pages/UpdateInformationPage';
import WorkspaceSettingPage from 'pages/WorkspaceSetting';
import WorkspaceConnectDrive from 'pages/WorkspaceConnectGoogle';
import ContentPlayerPage from 'pages/ContentPlayerPage';
import CoursesPage from 'pages/Courses';
import MyWorkspacePage from 'pages/MyWorkspacePage';
import CourseDetail from 'pages/CourseDetail';
import AdminRouter from './AdminRouter';
import WorkspaceDrivePage from 'pages/WorkspaceDrive';
import CreatorRoute from './CreatorRouter';
import GroupListManagementPage from 'pages/Management/Group/GroupList';
import GroupDetailPage from 'pages/Management/Group/GroupDetail';
import ClassroomListManagementPage from 'pages/Management/Classroom/ClassroomList';
import ClassroomDetailPage from 'pages/Management/Classroom/ClassroomDetail';
import ClassListPage from 'pages/Management/Class/ClassList';
import ClassDetailPage from 'pages/Management/Class/ClassDetail';
import TeacherDetailPage from 'pages/Management/Teacher/TeacherDetails';
import TeacherListPage from 'pages/Management/Teacher/TeacherList';
import StudentListPage from 'pages/Management/Student/StudentList';
import StudentDetailPage from 'pages/Management/Student/StudentDetail';
import TrashBinMyDrivePage from 'pages/TrashBinMyDrive';
import ReportGeneral from 'pages/Management/Report/ReportGeneral';
import ReportTeacher from 'pages/Management/Report/ReportTeacher';

type RoutesProps = {
    isAuthStorage: boolean;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    storageUserInfo?: AuthLocalStorageType;
    storageUserInfoSession?: AuthLocalStorageType;
};

const routes = (props: RoutesProps) => {
    // TEST FROM EMAIL
    // http://localhost:3000/login?email=tuananh.nguyen.business@gmail.com&default_password=True
    // http://localhost:3000/password/forgot?token=53a1b617-f429-434a-9a66-a841bf62151d
    const {
        isAuthStorage,
        setAuthStorage,
        storageUserInfo,
        storageUserInfoSession,
    } = props;

    return (
        <Switch>
            {/* GOOGLE DRIVE */}
            <AuthRoute
                path="/google/login"
                component={GoogleResponsePage}
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
                storageUserInfo={storageUserInfo}
            />
            <CommonRoute
                path="/login"
                component={LoginPage}
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
            />
            <PrivateRoute
                path="/contents/:uid/embed"
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
                component={EmbededPage}
            />
            <NormalRoute path="/contents/:uid/embed" component={EmbededPage} />
            {/* <NormalRoute path="/contents/:uid/embed" component={EmbededPage} /> */}
            <NormalRoute
                path="/register"
                component={RegisterPage}
                setAuthStorage={setAuthStorage}
            />
            <NormalRoute
                path="/password/forgot"
                component={ForgotPasswordPage}
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
                storageUserInfo={storageUserInfo}
            />
            <AuthTemporaryRoute
                path="/password/create"
                component={CreatePasswordPage}
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
                storageUserInfo={storageUserInfo}
                storageUserInfoSession={storageUserInfoSession}
            />
            <AuthRoute
                path="/workspace/create"
                component={CreateWorkspacePage}
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
                storageUserInfo={storageUserInfo}
            />
            {/* <AuthRoute
                path="/workspace/invite"
                component={InviteWorkspaceMemberPage}
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
                storageUserInfo={storageUserInfo}
            /> */}
            <AuthRoute
                path="/password/update"
                component={UpdatePasswordPage}
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
                storageUserInfo={storageUserInfo}
            />
            <CreatorRoute
                path="/workspace/:id/setting"
                component={WorkspaceSettingPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
            />
            <PrivateRoute
                path="/workspace/:id/management/groups/:groupId"
                component={GroupDetailPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
                newBar={NewBarType.Management}

            />
            <PrivateRoute
                path="/workspace/:id/management/groups"
                component={GroupListManagementPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
                newBar={NewBarType.Management}

            />
            <PrivateRoute
                path="/workspace/:id/management/student/:studentId"
                component={StudentDetailPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
                newBar={NewBarType.Management}

            />

            <PrivateRoute
                path="/workspace/:id/management/teacher/:teacherId"
                component={TeacherDetailPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
                newBar={NewBarType.Management}

            />
            <PrivateRoute
                path="/workspace/:id/management/classroom/:classroomId"
                component={ClassroomDetailPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
                newBar={NewBarType.Management}

            />
            <PrivateRoute
                path="/workspace/:id/management/classroom"
                component={ClassroomListManagementPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
                newBar={NewBarType.Management}

            />
            <PrivateRoute
                path="/workspace/:id/management/class/:classId"
                component={ClassDetailPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
                newBar={NewBarType.Management}
            />
            <PrivateRoute
                path="/workspace/:id/management/class"
                component={ClassListPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
                newBar={NewBarType.Management}
            />
            <PrivateRoute
                path="/workspace/:id/management/teacher"
                component={TeacherListPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
                newBar={NewBarType.Management}

            />

            <PrivateRoute
                path="/workspace/:id/management/student"
                component={StudentListPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
                newBar={NewBarType.Management}

            />

            <PrivateRoute
                path="/workspace/:id/report/general"
                component={ReportGeneral}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
            />

            <PrivateRoute
                path="/workspace/:id/report/teacher"
                component={ReportTeacher}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
            />

            <PrivateRoute
                path="/workspace/:id/connect-drive"
                component={WorkspaceConnectDrive}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Uploads}
            />
            <PrivateRoute
                path="/workspace/:id/h5p-content/:contentId/preview"
                component={ContentPlayerPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
            />
            <PrivateRoute
                path="/workspace/:id/h5p-content/new"
                component={H5PBuilderPage}
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Library}
                newBar={NewBarType.Academics}
            />
            <PrivateRoute
                path="/workspace/:id/h5p-content/:contentId"
                component={H5PPlayerPage}
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Library}
                newBar={NewBarType.Academics}
            />

            <PrivateRoute
                path="/workspace/:id/h5p-content"
                component={H5PPage}
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Library}
                newBar={NewBarType.Academics}
            />
            <PrivateRoute
                path="/workspace/:id/lesson/:lessonId/preview"
                component={H5PPreviewPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
            />
            <PrivateRoute
                path="/workspace/:id/lesson/:lessonId"
                component={LessonBuilder}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Library}
                newBar={NewBarType.Academics}
            />
            <PrivateRoute
                path="/workspace/:id/lesson"
                component={LessonPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Library}
                newBar={NewBarType.Academics}
            />
            <PrivateRoute
                path="/workspace/:id/course/:courseId"
                component={CourseDetail}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Library}
                newBar={NewBarType.Academics}
            />
            <PrivateRoute
                path="/workspace/:id/courses"
                component={CoursesPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Library}
                newBar={NewBarType.Academics}
            />
            <AdminRouter
                path="/workspace/:id/admin"
                component={AdminPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Library}
                newBar={NewBarType.Academics}
            />
            <PrivateRoute
                path="/workspace/:id/user-setting"
                component={UserAccountSettingPage}
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Manage}
            />
            <PrivateRoute
                path="/workspace/:id/my-drive/trash"
                component={TrashBinMyDrivePage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Library}
            />
            <PrivateRoute
                path="/workspace/:id/trash"
                component={WorkspaceTrashBin}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Library}
                newBar={NewBarType.Academics}
            />
            <PrivateRoute
                path="/workspace/:id/folders/:folderId"
                component={WorkspaceFolderViewPage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Uploads}
            />
            <PrivateRoute
                path="/workspace/:id/workspace-drive"
                component={WorkspaceDrivePage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Uploads}
            />
            <PrivateRoute
                path="/workspace/:id/:type/"
                component={WorkspaceHomepage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Uploads}
            />
            <PrivateRoute
                path="/workspace/:id/share"
                component={WorkspaceTrashBin}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Uploads}
            />
            <PrivateRoute
                path="/workspace/:id"
                component={WorkspaceHomepage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
                barType={BarType.Dashboard}
            />
            <AuthRoute
                path="/information/update"
                component={UpdateInformationPage}
                isAuthStorage={isAuthStorage}
                setAuthStorage={setAuthStorage}
                storageUserInfo={storageUserInfo}
            />
            <AuthRoute
                path="/"
                component={MyWorkspacePage}
                setAuthStorage={setAuthStorage}
                isAuthStorage={isAuthStorage}
                storageUserInfo={storageUserInfo}
            />
        </Switch>
    );
};

export default routes;
