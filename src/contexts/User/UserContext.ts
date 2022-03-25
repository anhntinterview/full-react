import { Dispatch, createContext } from 'react';
// STATES
import {
    initUserState,
    initUpdateUserState,
    initUploadAvatarState,
} from 'state/User/user.state';

// TYPES
import { UserState, UpdateUserState, UploadAvatarState } from 'types/User.type';

export const UserContext = createContext<{
    userState: UserState;
    dispatch: Dispatch<any>;
}>({
    userState: initUserState,
    dispatch: () => null,
});

export const UpdateUserContext = createContext<{
    updateUserState: UpdateUserState;
    dispatch: Dispatch<any>;
}>({
    updateUserState: initUpdateUserState,
    dispatch: () => null,
});

export const UploadAvatarContext = createContext<{
    uploadAvatarState: UploadAvatarState;
    dispatch: Dispatch<any>;
}>({
    uploadAvatarState: initUploadAvatarState,
    dispatch: () => null,
});
