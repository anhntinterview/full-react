import { RestfulService } from './restful.service';
import { GOOGLE } from 'constant/google.const';
import {
    GoogleFiles,
    GoogleFilesResponse,
    GooglePermissionResponse,
    GoogleTypeFolder,
} from 'types/GoogleType';
import { getAttrLocalStorage } from 'utils/handleLocalStorage';
import { GOOGLE_SERVER_SIDE } from 'constant/api.const';

const getListGoogleDrive = async (
    body: Record<string, any>
): Promise<GoogleFilesResponse | undefined> => {
    const access_token = getAttrLocalStorage('access_token', 'google_auth');
    if (access_token) {
        const params =
            (body &&
                `${Object.keys(body)
                    .map((i) => `${i}=${body[i]}`)
                    .join('&')}`) ||
            null;
        const url = `${GOOGLE.API_AND_SERVICES.API.DRIVE}/files?access_token=${access_token}&${params}`;
        const res = await RestfulService.getApi(url);
        if (res.status === 401 || res.status !== 200) {
            localStorage.removeItem('google_auth');
            return;
        }
        const parseResponse = res.data;

        return parseResponse;
    }
};

const updateGoogleFile = async (p: {
    fieldId: string;
    args: Record<string, any>;
    body?: Record<string, any>;
}) => {
    const { args, fieldId, body } = p;
    const params =
        (args &&
            `?${Object.keys(args)
                .map((i) => `${i}=${args[i]}`)
                .join('&')}`) ||
        null;
    const url = `${GOOGLE_SERVER_SIDE.DRIVER.URL}${fieldId}${params}`;
    const res = await RestfulService.patchGoogleApi(url, body);
    const temp: Promise<GoogleFiles> = await res.json();
    return temp;
};

const updateNewFolderGoogleDrive = async (
    body: GoogleTypeFolder
): Promise<GoogleFiles | undefined> => {
    const access_token = getAttrLocalStorage('access_token', 'google_auth');
    console.log(access_token);
    // const access_token = getAttrLocalStorage('token', 'google_oauth_token');
    if (access_token) {
        const res = await RestfulService.postBearerApi(
            `${GOOGLE.API_AND_SERVICES.API.FOLDER}?fields=*`,
            access_token,
            { ...body }
        );
        const parseResponse: Promise<GoogleFiles> = res.json();
        console.log(parseResponse);

        return parseResponse;
    }
};

const uploadFileGoogleDrive = async (body: FormData) => {
    const access_token = getAttrLocalStorage('access_token', 'google_auth');
    if (access_token) {
        const res = await RestfulService.postBearerApiFormData(
            `${GOOGLE.API_AND_SERVICES.API.FILE_UPLOAD}multipart&fields=*`,
            access_token,
            body
        );
        return res.json();
    }
};

const getGoogleDriveFile = async (
    fileId: string,
    body?: Record<string, string>
): Promise<GoogleFiles | undefined> => {
    const access_token = getAttrLocalStorage('access_token', 'google_auth');

    if (access_token) {
        // const params =
        //     (body &&
        //         `${Object.keys(body)
        //             .map((i) => `${i}=${body[i]}`)
        //             .join('&')}`) ||
        //     null;
        const res = await RestfulService.getBearerApi(
            `${GOOGLE.API_AND_SERVICES.API.FOLDER}/${fileId}?fields=*`,
            access_token
        );
        const temp: Promise<GoogleFiles> = await res.json();

        return temp;
    }
    return undefined;
};

const updateFilePermissions = async (
    fileId: string,
    permissionId: string,
    body: Record<any, string>
) => {
    const access_token = getAttrLocalStorage('access_token', 'google_auth');

    if (access_token) {
        const res = await RestfulService.patchGoogleApi(
            `${GOOGLE_SERVER_SIDE.DRIVER.URL}${fileId}/permissions/${permissionId}?fields=*`,
            body
        );
        const temp = await res.json();
        return temp;
    }
    return undefined;
};

const createFilePermission = async (
    fileId: string,
    optionalParam: Record<any, any>,
    requestBody: Record<any, any>
) => {
    const access_token = getAttrLocalStorage('access_token', 'google_auth');
    if (access_token) {
        const params =
            (optionalParam &&
                `${Object.keys(optionalParam)
                    .map((i) => `${i}=${optionalParam[i]}`)
                    .join('&')}`) ||
            null;
        const res = await RestfulService.postBearerApi(
            `${GOOGLE_SERVER_SIDE.DRIVER.URL}${fileId}/permissions?${params}`,
            access_token,
            requestBody
        );
        if (res.ok) {
            const temp = await res.json();
            return temp;
        }
    }
    return undefined;
};

const copyFile = async (fileId: string, body: Record<any, any>) => {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}/copy`;
    const access_token = getAttrLocalStorage('access_token', 'google_auth');

    if (access_token) {
        const req = await RestfulService.postBearerApi(url, access_token, {
            ...body,
        });

        const res = await req.json();
        return res;
    }
    return undefined;
};

const deleteFilePermission = async (fileId: string, permissionId: string) => {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions/${permissionId}`;
    const access_token = getAttrLocalStorage('access_token', 'google_auth');

    if (access_token) {
        const res = await RestfulService.deleteApi(url, access_token);
        if (res.status === 204 && res.ok) {
            return true;
        }
        return false;
    }
    return false;
};

const getFilePermissions = async (
    fileId: string
): Promise<GooglePermissionResponse | undefined> => {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions?fields=permissions(emailAddress,id,type)`;
    const access_token = getAttrLocalStorage('access_token', 'google_auth');
    if (access_token && fileId) {
        const req = await RestfulService.getBearerApi(url, access_token);
        if (req.ok) {
            return req.json();
        }
    }
    return undefined;
};

export default {
    getListGoogleDrive,
    updateGoogleFile,
    updateNewFolderGoogleDrive,
    uploadFileGoogleDrive,
    getGoogleDriveFile,
    updateFilePermissions,
    createFilePermission,
    copyFile,
    deleteFilePermission,
    getFilePermissions,
};
