import { AuthState, AuthType, AuthLocalStorageType } from 'types/Auth.type';

export const initInputOtp = {
    otp: '',
    numInputs: 6,
    separator: '',
    isDisabled: false,
    hasErrored: false,
    isInputNum: false,
    isInputSecure: false,
    minLength: 0,
    maxLength: 40,
    placeholder: '',
};

export const initAuthLocalStorage: AuthLocalStorageType = {
    access_token: '',
    email: '',
    has_login_account: undefined,
    id: undefined,
    time_zone: '',
    avatar_url: '',
    name: '',
    country: '',
    display_name: '',
    first_name: '',
    language: '',
    last_name: '',
    dob: '',
};

export const initAuthState: AuthState = {
    isLoading: false,
    result: undefined,
    params: '',
    status: '',
    err: undefined,
    defaultPassword: false,
};

export const initAuthStore: AuthType = {
    id: undefined,
    email: '',
    time_zone: '',
    has_login_account: undefined,
    access_token: '',
    defaultPassword: false,
    dob: '',
    country: '',
    display_name: '',
    first_name: '',
    language: '',
    last_name: '',
};
