import { RestfulService } from './restful.service';
import { AUTH, HOST_URL, USER } from 'constant/api.const';
import {
    RegisterCreateTemporaryUserBodyType,
    RegisterVerifyEmailBodyType,
} from 'types/Register.type';
import { CreatePasswordArgsType } from 'types/CreatePassword.type';

const createTemporaryUser = async (
    body: RegisterCreateTemporaryUserBodyType
) => {
    if (body) {
        const res = await RestfulService.postApi(
            HOST_URL + USER.CREATE_TEMPORARY_USER,
            body
        );
        if (!!res.data.error) {
            throw res.data;
        }
        if (res.status === 204) {
            return true;
        }
    }
};

const verifyEmail = async (body: RegisterVerifyEmailBodyType) => {
    if (body) {
        const res = await RestfulService.postApi(
            HOST_URL + AUTH.VERIFY_EMAIL,
            body
        );
        return res.data;
    }
};

const createPassword = async (body: CreatePasswordArgsType) => {
    if (body) {
        console.log(`body: `, body);
        const { password, temporary_access_token } = body;
        const res = await RestfulService.postBearerApi(
            HOST_URL + USER.CREATE_NEW_PASSWORD,
            temporary_access_token,
            { password }
        );
        if (!!res.data.error) {
            throw res.data;
        }
        return res;
    }
};

export default {
    createTemporaryUser,
    verifyEmail,
    createPassword,
};
