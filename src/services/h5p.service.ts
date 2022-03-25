// TYPES
import {
    IContentListEntry,
    IH5PContentList,
    IH5PPlayerArgs,
    TagsType,
} from 'types/H5P.type';
// UTILS
import {
    getAttrLocalStorage,
    getCurrentEmail,
    getLocalStorageAuthData,
} from 'utils/handleLocalStorage';
import { H5P, HOST_URL } from 'constant/api.const';
// SERVICES
import { RestfulService } from './restful.service';
// PACKAGES
import { IEditorModel, IPlayerModel } from 'packages/h5p-server';
import { ApprovalBody } from 'types/ApiData.type';

const getToken = () => {
    const currentEmail = getCurrentEmail();
    return getAttrLocalStorage('access_token', `user_info_${currentEmail}`);
};

const h5pApproveContent = async (args: IH5PPlayerArgs) => {
    const res = await RestfulService.postApi(
        `${H5P.root(args.workspaceId)}${H5P.approveContent(args.contentId)}`
    );
    if (res.status === 204) {
        return true;
    } else throw new Error('Request is already approved or cancelled!');
};

const h5pContentList = async (
    workspaceId: string,
    params?: Record<any, any>
) => {
    if (workspaceId) {
        const p: string[] = [];
        if (params) {
            Object.keys(params).forEach((i) => {
                if (i && params[i]) {
                    p.push(`${i}=${params[i]}`);
                }
            });
        }
        const url = `${H5P.root(workspaceId)}${p.length ? `?${p.join('&')}` : ''
            }`;
        const res = await RestfulService.getApi(url);
        if (!!res.data.error) {
            throw res.data;
        }
        return res.data;
    }
};

const h5pEditor = async (args: IH5PPlayerArgs) => {
    if (args) {
        const { workspaceId, contentId } = args;
        const res = await RestfulService.getApi(
            `${H5P.root(workspaceId)}${H5P.edit(contentId)}`
        );
        return res.data;
    }
};

const h5pPlayer = async (args: IH5PPlayerArgs) => {
    if (args) {
        const { workspaceId, contentId } = args;
        const res = await RestfulService.getApi(
            `${H5P.root(workspaceId)}${H5P.play(contentId)}`
        );
        return res.data;
    }
};

const h5pListPromise = async (
    workspaceId: string,
    params?: Record<any, any>
): Promise<IH5PContentList> => {
    const p =
        (params &&
            `${Object.keys(params)
                .map((i) => {
                    if (i && params[i]) return `${i}=${params[i]}`;
                    return null;
                })
                .join('&')}`) ||
        null;
    const url = `${H5P.root(workspaceId)}${p ? `?${p}` : ''}`;
    const result = await RestfulService.getApi(url);
    if (!result) {
        // console.log(
        //     `Request to REST endpoint returned ${result.status} ${
        //         result.statusText
        //     }: ${await result.text()}`
        // );
        // throw new Error(
        //     `Request to REST endpoint returned ${result.status} ${
        //         result.statusText
        //     }: ${await result.text()}`
        // );
    }
    if (!!result.data.error) {
        throw result.data.error;
    }
    return result.data;
};

// const h5pListPromise = async (
//     workspaceId: string
// ): Promise<IH5PContentList> => {
//     const result = await fetch(`${H5P.root(workspaceId)}`, {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     });
//     if (!result || !result.ok) {
//         console.log(
//             `Request to REST endpoint returned ${result.status} ${
//                 result.statusText
//             }: ${await result.text()}`
//         );
//         // throw new Error(
//         //     `Request to REST endpoint returned ${result.status} ${
//         //         result.statusText
//         //     }: ${await result.text()}`
//         // );
//     }
//     return result.json();
// };

const h5pUidPlayerPromise = async (
    contentUid: string
): Promise<IPlayerModel> => {
    const res = await RestfulService.getApi(`${H5P.uidPlay(contentUid)}`);
    if (!res) {
        console.log(`${res.status} ${res.statusText}`);
        // throw new Error(`${res.status} ${res.statusText}`);
    }
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const h5pPlayerPromise = async (
    args: IH5PPlayerArgs
): Promise<IPlayerModel> => {
    const res = await RestfulService.getApi(
        `${H5P.root(args?.workspaceId)}${H5P.play(args?.contentId)}`
    );
    if (!res) {
        console.log(`${res.status} ${res.statusText}`);
        // throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.data;
};

const h5pDeletePromise = async (args: IH5PPlayerArgs) => {
    const token = getToken();
    const result = await RestfulService.postApi(
        `${H5P.root(args?.workspaceId)}${H5P.delete(args?.contentId)}`
    );
    if (!!result.data.error) {
        throw result.data.error;
    }
    if (result.status === 204) {
        return true;
    }
};

const h5pEditPromise = async (args: IH5PPlayerArgs): Promise<IEditorModel> => {
    const token = getToken();
    const res = await RestfulService.getApi(
        `${H5P.root(args?.workspaceId)}${H5P.edit(args?.contentId)}`
        // {
        //     headers: {
        //         Authorization: `Bearer ${token}`,
        //     },
        // }
    );
    if (!res || !res.status) {
        console.log(`${res.status} ${res.statusText}`);
        // throw new Error(`${res.status} ${res.statusText}`);
    }
    return res.data;
};

// Save or Update
const h5pSavePromise = async (
    argsId: IH5PPlayerArgs,
    requestBody: { library: string; params: any }
) => {
    if (argsId) {
        console.log(`ContentService: Saving new content.`);
    } else {
        console.log(`ContentService: Saving content ${argsId} `);
    }
    const workspaceId = argsId.workspaceId;
    const body = JSON.stringify(requestBody);
    const token = getToken();

    const res =
        argsId.contentId !== 'new'
            ? await RestfulService.patchApi(
                `${H5P.root(argsId?.workspaceId)}${H5P.save(
                    argsId?.contentId
                )}`,
                requestBody
            )
            : await RestfulService.postApi(H5P.root(workspaceId), requestBody);
    if (!res) {
        console.error(`${res.status} ${res.statusText} `);
        // throw new Error(
        //     `${res.status} ${res.statusText} - ${await res.text()}`
        // );
    }
    return res.data;
};
const generateDownloadLink = (args: IH5PPlayerArgs): string =>
    `${H5P.root(args?.workspaceId)}${H5P.download(args?.contentId)}`;

const h5pAddTag = async (args: IH5PPlayerArgs, tags: TagsType) => {
    if (tags.tags.length) {
        const res = await RestfulService.postApi(
            `${H5P.root(args?.workspaceId)}${H5P.addTags(args?.contentId)}`,
            tags
        );
        if (!res) {
            console.error('Cannot add tag');
        }
        if (!!res.data.error) {
            throw -1;
        }
        if (res.status === 204) {
            return 1;
        }
    }
    return 0;
};

const h5pRemoveTag = async (args: IH5PPlayerArgs, tagId: number) => {
    const res = await RestfulService.deleteApi(
        `${H5P.root(args?.workspaceId)}${H5P.addTags(args?.contentId)}/${tagId}`
    );
    if (!res) {
        console.error('Cannot remove tag');
    }
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const h5pRemoveMultiTag = async (args: IH5PPlayerArgs, tags: TagsType) => {
    if (tags.tags.length) {
        const res = await RestfulService.deleteApi(
            `${H5P.root(args?.workspaceId)}${H5P.addTags(args?.contentId)}`,
            tags
        );
        if (!res) {
            console.error('Cannot remove tag');
        }
        if (!!res.data.error) {
            throw -1;
        }
        if (res.status === 204) {
            return 1;
        }

    }
    return 0;
};
const createH5PApproval = async (
    workspaceId: string,
    ContentId: string,
    body: ApprovalBody
) => {
    const url = `${HOST_URL}/h5p/workspaces/${workspaceId}/${ContentId}/approval`;

    const req = await RestfulService.postApi(url, body);
    if (!!req.data.error) {
        throw req.data.error;
    }
    return true;
};

const cancelH5PApproval = async (args: IH5PPlayerArgs) => {
    const url = `${HOST_URL}/h5p/workspaces/${args.workspaceId}/${args.contentId}/approval`;

    const req = await RestfulService.deleteApi(url);
    if (!!req.data.error) {
        throw req.data.error;
    }
    return true;
};

const recoverH5P = async (workspaceId: string, contentId: number) => {
    const url = `${HOST_URL}/h5p/workspaces/${workspaceId}/${contentId}/recover`;

    const req = await RestfulService.postApi(url);
    if (!!req.data.error) {
        throw req.data.error;
    }
    return true;
};

export default {
    h5pUidPlayerPromise,
    h5pApproveContent,
    h5pContentList,
    h5pEditor,
    h5pPlayer,
    h5pListPromise,
    h5pPlayerPromise,
    h5pDeletePromise,
    h5pEditPromise,
    h5pSavePromise,
    generateDownloadLink,
    h5pAddTag,
    createH5PApproval,
    cancelH5PApproval,
    recoverH5P,
    h5pRemoveTag,
    h5pRemoveMultiTag,
};
