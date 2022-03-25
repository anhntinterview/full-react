import { ICreateClassParams } from 'types/Class.type';
import ClassService from 'services/class.service';

export const createNewClass = async (
    workspaceId: string,
    param: ICreateClassParams
) => {
    return ClassService.createClass(workspaceId, param);
};
