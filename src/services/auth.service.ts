import { RestfulService } from './restful.service';
// CONSTANTS
import { AUTH, HOST_URL } from 'constant/api.const';
// TYPES
import { AuthLoginBodyType } from 'types/Auth.type';
import { ForgotPasswordArgsType } from 'types/ForgotPassword.type';
import { ResetPasswordArgsType } from 'types/ResetPassword.type';
import { getLocalCookie } from 'utils/handleAuthorized';

const login = async (body: AuthLoginBodyType) => {
    if (body) {
        const res = await RestfulService.postApi(HOST_URL + AUTH.LOGIN, body);

        if (!!res.data.error) {
            throw res.data;
        }
        return res.data;
    }
};

const logout = async () => {
    const hasCookie = !!getLocalCookie();
    if (!hasCookie) {
        return false;
    }
    const res = await RestfulService.deleteApi(AUTH.LOGOUT);
    if (res.status === 204) {
        return true;
    }
};

const forgotPassword = async (body: ForgotPasswordArgsType) => {
    if (body) {
        const { email } = body;
        const res = await RestfulService.postApi(
            HOST_URL + AUTH.FORGOT_PASSWORD,
            { email }
        );
        return res;
    }
};

const resetPassword = async (body: ResetPasswordArgsType) => {
    if (body) {
        const { code, password, email } = body;
        const res = await RestfulService.postApi(
            HOST_URL + AUTH.RESET_PASSWORD,
            { email, code, password }
        );
        return res;
    }
};

export default {
    login,
    forgotPassword,
    resetPassword,
    logout,
};
