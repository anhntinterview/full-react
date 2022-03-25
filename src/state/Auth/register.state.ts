import { RegisterState } from 'types/Register.type';

export const initRegisterState: RegisterState = {
    isLoading: false,
    registerResult: undefined,
    verifyEmailResult: undefined,
    createNewPasswordResult: undefined,
    params: '',
    status: '',
    err: undefined,
};
