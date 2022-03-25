import {
    NormalResponseError,
    ValidateResponseErrors,
    IObjectKeys,
} from './Common.type';

export type InputOtp = {
    otp: string;
    numInputs: number;
    separator: string;
    isDisabled: boolean;
    hasErrored: boolean;
    isInputNum: boolean;
    isInputSecure: boolean;
    minLength: number;
    maxLength: number;
    placeholder: string;
};

// export type JWTDecodeType = {
//     context: {
//         sub_type: string;
//         token_type: string;
//     };
//     exp: number;
//     iat: number;
//     sub: string;
// };

export type JWTDecodeType = {
    type: string;
    iat: number;
    exp: number;
    sub: string;
    rti: number;
    jti: string;
};

// *** AUTH LOCAL STORAGE ***
export interface AuthLocalStorageType extends IObjectKeys {
    access_token: string | undefined;
    avatar_url: string | undefined;
    name: string | undefined;
    email: string;
    has_login_account: boolean | undefined;
    id: number | undefined;
    time_zone: string | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    display_name: string | undefined;
    country: string | undefined;
    language: string | undefined;
    dob: string | undefined;
}

// *** AUTH ***
export type AuthLoginBodyType = {
    email: string | undefined;
    password: string | undefined;
};

export type AuthType = {
    id: number | undefined;
    email: string;
    time_zone: string | undefined;
    has_login_account: boolean | undefined;
    access_token: string | undefined;
    defaultPassword: boolean;
    temporary_access_token?: string | undefined;
    first_name: string | undefined;
    last_name: string | undefined;
    display_name: string | undefined;
    country: string | undefined;
    language: string | undefined;
    dob?: string | undefined;
};

export interface AuthState {
    isLoading: boolean;
    result: AuthType | undefined;
    params: string;
    status: string;
    err: NormalResponseError | undefined;
    defaultPassword: boolean;
}

export interface AuthAction extends AuthState {
    type: string;
}
