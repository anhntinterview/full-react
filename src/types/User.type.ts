import {
    NormalResponseError,
    ValidateResponseErrors,
    IObjectKeys,
} from './Common.type';

export interface UserType extends IObjectKeys {
    id: number;
    email: string;
    name: string;
    time_zone: string;
    avatar_url: string;
    language: string;
    has_login_account: boolean;
    dob: string;
    first_name: string;
    last_name: string;
    display_name: string;
    country: string;
}

export interface UserState {
    isLoading: boolean;
    result: UserType | undefined;
    params: string;
    status: string;
    role: string;
    isCreator: boolean;
    err: NormalResponseError | undefined;
    errVal: ValidateResponseErrors | undefined;
}

export interface UserAction extends UserState {
    type: string;
}

// UPDATE USER
export type UpdateUserType = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
    avatar_url: string;
    display_name: string;
    datetime_format: string;
    time_zone: string;
    country: string;
    language: string;
    has_login_account: boolean;
    dob: string;
};

export interface UpdateUserArgsType {
    name?: string;
    time_zone: string;
    first_name?: string;
    last_name?: string;
    country?: string;
    language?: string;
    datetime_format?: string;
    avatar?: File;
    dob?: string;
}

export interface UpdateUserState {
    isLoading: false;
    result: UpdateUserType | undefined;
    params: string;
    status: string;
    err: NormalResponseError | undefined;
}

export interface UpdateUserAction extends UpdateUserState {
    type: string;
}

// UPLOAD RESOURCE, e.g: image...
export interface UploadResourceArgsType {
    public: boolean;
    mime_type: string;
    file_extension: string;
}

export interface UploadAvatarFormData {
    AWSAccessKeyId: string;
    'Content-Type': string;
    acl: string;
    key: string;
    policy: string;
    signature: string;
    tagging: string;
    'x-amz-security-token': string;
}

export interface UploadAvatarFormDataResult {
    fields: UploadAvatarFormData;
    url: string;
}

export interface UploadAvatarFinalArgsType {
    avatar: string;
}

export interface UploadAvatarFinalResult {
    id: number;
    email: string;
    name: string;
    time_zone: string;
    avatar_url: string;
    has_login_account: boolean;
}

export interface UploadAvatarFormDataArgsType
    extends UploadAvatarFormDataResult {
    file: File;
}

export interface UploadAvatarState {
    isLoading: boolean;
    result: UploadAvatarFormDataResult | undefined;
    path: string | undefined;
    avatarFinalResult: UploadAvatarFinalResult | undefined;
    params: string;
    status: string;
    avatarFinalErr: NormalResponseError | undefined;
    avatarFinalValidateErr: ValidateResponseErrors | undefined;
    formDataErr: undefined;
    err: NormalResponseError | undefined;
    errVal: ValidateResponseErrors | undefined;
}

export interface UploadeAvatarAction extends UploadAvatarState {
    type: string;
}
