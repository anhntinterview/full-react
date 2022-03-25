import { UserState, UpdateUserState, UploadAvatarState } from 'types/User.type';

export const initUserState: UserState = {
    isLoading: false,
    result: { id: 0, language: '', first_name: '', last_name: '', country: null, email: '', name: '', time_zone: '', avatar_url: '', has_login_account: false, dob: '', display_name: '' },
    params: '',
    status: '',
    role: '',
    isCreator: false,
    err: undefined,
    errVal: undefined,
};

export const initUpdateUserState: UpdateUserState = {
    isLoading: false,
    result: undefined,
    params: '',
    status: '',
    err: undefined,
};

export const initUploadAvatarState: UploadAvatarState = {
    isLoading: false,
    result: undefined,
    path: undefined,
    avatarFinalResult: undefined,
    avatarFinalErr: undefined,
    avatarFinalValidateErr: undefined,
    formDataErr: undefined,
    params: '',
    status: '',
    err: undefined,
    errVal: undefined,
};
