import { RestfulService } from './restful.service';
import { USER, HOST_URL } from 'constant/api.const';
import { UpdatePasswordArgsType } from 'types/UpdatePassword.type';
import {
    UpdateUserArgsType,
    UploadResourceArgsType,
    UploadAvatarFinalArgsType,
    UploadAvatarFormDataResult,
} from 'types/User.type';
import { NormalResponseError } from 'types/Common.type';

const uploadAvatarFinal = async (body: UploadAvatarFinalArgsType) => {
    if (body) {
        const { avatar } = body;
        const res = await RestfulService.postApi(
            HOST_URL + USER.UPLOAD_AVATR_FINAL,
            { avatar }
        );
        return res.data;
    }
};

const uploadImageToAWS = async (body: FormData, url: string) => {
    if (body) {
        console.log(`body: `, body);
        const res = await RestfulService.postApiFormData(url, body);
        console.log(res);
        return res.status;
    }
};

const uploadResource = async (body: UploadResourceArgsType) => {
    if (body) {
        console.log(`body: `, body);
        const { mime_type, file_extension } = body;
        const filePublic = body.public;
        const res = await RestfulService.postApi(
            HOST_URL + USER.UPLOAD_AVATAR,
            { mime_type, file_extension, public: filePublic }
        );
        return res.data;
    }
};

/**
 * Upload image to CDN
 * @param image
 * @param access_token token of current user
 * @param canvas is optional
 * @param onError
 * @param onSuccess callback to getting image path after uploading to CDN
 * */
const uploadImage = async (
    image: File,
    onSuccess: (path: string) => void,
    onError: (error: NormalResponseError | undefined) => void,
    canvas?: HTMLCanvasElement | undefined
) => {
    const re = /(?:\.([^.]+))?$/;
    const fileExtension = `.${re.exec(image.name)![1]}`;
    const fileType = image.type;
    //post resource metadata then get information for uploading CDN
    const resource = await uploadResource({
        public: true,
        mime_type: fileType,
        file_extension: fileExtension,
    });
    if (resource.error) {
        return onError(resource.error);
    }
    const uploadAvatarStateResult = resource as UploadAvatarFormDataResult;

    //prepare form for uploading to CDN
    const form: FormData = new FormData();
    form.append(
        'AWSAccessKeyId',
        uploadAvatarStateResult.fields.AWSAccessKeyId
    );
    form.append('Content-Type', uploadAvatarStateResult.fields['Content-Type']);
    form.append('acl', uploadAvatarStateResult.fields.acl);
    form.append('key', uploadAvatarStateResult.fields.key);
    form.append('policy', uploadAvatarStateResult.fields.policy);
    form.append('signature', uploadAvatarStateResult.fields.signature);
    form.append('tagging', uploadAvatarStateResult.fields.tagging);
    form.append(
        'x-amz-security-token',
        uploadAvatarStateResult.fields['x-amz-security-token']
    );
    let file: Blob | undefined;
    if (canvas) {
        const blobBin = atob(canvas.toDataURL(fileType).split(',')[1]);
        const array = [];
        for (let i = 0; i < blobBin.length; i++) {
            array.push(blobBin.charCodeAt(i));
        }
        file = new Blob([new Uint8Array(array)], { type: fileType });
    }

    form.append('file', file ?? image);

    await uploadImageToAWS(form, uploadAvatarStateResult.url)
        .then((result) => onSuccess(uploadAvatarStateResult.fields.key))
        .catch(onError);
};

const getUser = async () => {
    const res = await RestfulService.getApi(HOST_URL + USER.GET_USER);
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const updateUser = async (body: UpdateUserArgsType) => {
    if (body) {
        console.log(`body: `, body);
        const {
            time_zone,
            first_name,
            last_name,
            country,
            language,
            datetime_format,
            dob,
        } = body;
        const res = await RestfulService.putApi(HOST_URL + USER.UPDATE_USER, {
            time_zone,
            first_name,
            last_name,
            country,
            language,
            datetime_format,
            dob,
        });
        return res.data;
    }
};
const patchUpdateUser = async (body: Partial<UpdateUserArgsType>) => {
    if (body) {
        const res = await RestfulService.patchApi(HOST_URL + USER.UPDATE_USER, {
            ...body,
        });
        return res.data;
    }
};

const updatePassword = async (body: UpdatePasswordArgsType) => {
    if (body) {
        const { old_password, new_password } = body;
        const res = await RestfulService.putApi(
            HOST_URL + USER.UPDATE_PASSWORD,
            { old_password, new_password }
        );
        if (!!res.data.error) {
            throw res.data;
        }
        return res.data;
    }
};

export default {
    uploadAvatarFinal,
    uploadResource,
    getUser,
    updateUser,
    updatePassword,
    uploadImage,
    patchUpdateUser
};
