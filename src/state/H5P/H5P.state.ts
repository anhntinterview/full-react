import { IH5PContentList, IH5PState } from 'types/H5P.type';

export const initH5PState: IH5PState = {
    isLoading: false,
    h5PApproveContentResult: undefined,
    h5PContentListResult: undefined,
    h5PEditorResult: undefined,
    h5PPlayerResult: undefined,
    currentH5P: undefined,
    params: {
        page: undefined,
        per_page: undefined,
        total: undefined,
        order: 'desc',
        sort_by: 'updated_on',
        title: '',
        content_type: [],
    },
    status: '',
    err: undefined,
};
// LEGACY SYSTEM
export const initH5PContentList: IH5PContentList = {
    items: [],
    // order: undefined,
    page: undefined,
    per_page: undefined,
    // sort_by: undefined,
    total: undefined,
    order: 'desc',
    sort_by: 'updated_on',
    title: '',
    content_type: '',
};
