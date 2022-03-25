import { HOST_URL, CLASS } from 'constant/api.const';
import {
    IClassResponse,
    IClassSessionParams,
    ICreateClassParams,
    IGetClassParams,
    IPatchClassParams,
} from 'types/Class.type';
import { MemberInviteType } from 'types/GetListOfWorkspace.type';
import { RestfulService } from './restful.service';

const createClass = async (
    workspaceId: string,
    classParam: ICreateClassParams
): Promise<any> => {
    const res = await RestfulService.postApi(
        HOST_URL + CLASS.create(workspaceId),
        classParam
    );
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const getCLassList = async (
    workspaceId: string,
    params: IGetClassParams
): Promise<any> => {
    const res = await RestfulService.getApi(
        HOST_URL + CLASS.getList(workspaceId),
        params
    );
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const getClassDetail = async (
    workspaceId: string,
    classId: string
): Promise<any> => {
    const res = await RestfulService.getApi(
        HOST_URL + CLASS.getDetail(workspaceId, classId)
    );
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const updatePartialClass = async (
    workspaceId: string,
    classId: string,
    params: IPatchClassParams
) => {
    const res = await RestfulService.patchApi(
        HOST_URL + CLASS.update(workspaceId, classId),
        params
    );
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const updateClassStatus = async (
    workspaceId: string,
    classId: string,
    status: 'active' | 'deactivate'
) => {
    const res = await RestfulService.postApi(
        HOST_URL + CLASS.delete(workspaceId, classId),
        { status }
    );
    if (!!res.data.error) {
        throw res.data;
    }
    return true;
};

const getClassSession = async (
    workspaceId: string,
    classId: string,
    params?: IClassSessionParams
) => {
    const res = await RestfulService.getApi(
        HOST_URL + CLASS.getListSession(workspaceId, classId),
        params
    );
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const inviteEmail = async (
    workspaceId: string,
    classId: string,
    body: MemberInviteType
) => {
    const res = await RestfulService.postApi(
        HOST_URL + CLASS.inviteMembers(workspaceId, classId),
        body
    );
    if (!!res.data.error) {
        throw res.data;
    }

    return true;
};

const removeMemberClasses = async (
    workspaceId: string,
    classId: string,
    userId: number
) => {
    const res = await RestfulService.deleteApi(
        HOST_URL + CLASS.removeMembers(workspaceId, classId, userId)
    );
    if (!!res.data.error) {
        throw res.data;
    }

    return true;
};
const deleteSessions = async (
    workspaceId: string,
    classId: string,
    sessionId: string
) => {
    const res = await RestfulService.deleteApi(
        HOST_URL + CLASS.deleteSession(workspaceId, classId, sessionId)
    );
    if (!!res.data.error) {
        throw res.data;
    }

    return true;
};

const updateSessions = async (
    workspaceId: string,
    classId: string,
    sessionId: string,
    params: {
        start_time: string;
        end_time: string;
    }
) => {
    const res = await RestfulService.putApi(
        HOST_URL + CLASS.updateSessions(workspaceId, classId, sessionId),
        params
    );
    if (!!res.data.error) {
        throw res.data;
    }

    return sessionId;
};

export default {
    createClass,
    getCLassList,
    getClassDetail,
    updatePartialClass,
    updateClassStatus,
    getClassSession,
    inviteEmail,
    removeMemberClasses,
    deleteSessions,
    updateSessions,
};
