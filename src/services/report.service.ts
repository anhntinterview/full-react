import { RestfulService } from './restful.service';
// CONSTANTS
import { HOST_URL, REPORT } from 'constant/api.const';
// TYPES

const getGeneral = async (workspaceId: string) => {
    const res = await RestfulService.getApi(
        HOST_URL + REPORT.getGeneral(workspaceId),
    );
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const getTeacher = async (workspaceId: string) => {
    const res = await RestfulService.getApi(
        HOST_URL + REPORT.getTeacher(workspaceId),
    );
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

export default {
    getGeneral,
    getTeacher
};
