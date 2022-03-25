import {
    userReducer,
    updateUserReducer,
    uploadAvatarReducer,
} from './user/user.reducer';
import authReducer from './auth/auth.reducer';
import registerReducer from './auth/register.reducer';
import {
    createWorkspaceReducer,
    inviteMembersReducer,
    getListOfWorkspaceReducer,
    getWorkspaceDetailReducer,
    getWorkspaceAdminReducer,
} from './workspace/workspace.reducer';
import passwordReducer from './password/password.reducer';
import {
    googleReducer,
    googleServerSideReducer,
} from './google/google.reducer';
import { leftMenuReducers } from './leftMenu/leftMenu.reducer';
import h5pReducer from './h5p/h5p.reducer';
import { getReportReducer } from './report/report.reducer';

export default {
    h5pReducer,
    googleReducer,
    googleServerSideReducer,
    userReducer,
    uploadAvatarReducer,
    updateUserReducer,
    authReducer,
    registerReducer,
    createWorkspaceReducer,
    inviteMembersReducer,
    getListOfWorkspaceReducer,
    passwordReducer,
    getWorkspaceDetailReducer,
    leftMenuReducers,
    getWorkspaceAdminReducer,
    getReportReducer
};
