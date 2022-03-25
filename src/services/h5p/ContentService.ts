import type {
    IEditorModel,
    IPlayerModel,
    IContentMetadata,
} from 'packages/h5p-server';
import axiosInstance, { RestfulService } from 'services/restful.service';
import { GetListH5PParams } from 'types/ApiData.type';

import { getCurrentEmail, getAttrLocalStorage } from 'utils/handleLocalStorage';

export interface IContentListEntry {
    contentId: string;
    mainLibrary: string;
    title: string;
    originalNewKey?: string;
}

export interface IContentService {
    delete(contentId: string): Promise<void>;
    getEdit(contentId: string): Promise<any>;
    // getEdit(contentId: string): Promise<IEditorModel>;
    getPlay(contentId: string): Promise<IPlayerModel>;
    list(params?: GetListH5PParams): Promise<IContentListEntry[]>;
    save(
        contentId: string,
        requestBody: { library: string; params: any }
    ): Promise<{ contentId: string; metadata: IContentMetadata }>;
    generateDownloadLink(contentId: string): string;
}

export class ContentService implements IContentService {
    /**
     *
     */
    constructor(protected baseUrl: string = '') {}

    getToken = () => {
        const currentEmail = getCurrentEmail();
        const token = getAttrLocalStorage(
            'access_token',
            `user_info_${currentEmail}`
        );
        return token;
    };

    delete = async (contentId: string): Promise<void> => {
        const token = this.getToken();
        console.log(`ContentService: deleting ${contentId}...`);
        const result = await fetch(`${this.baseUrl}/${contentId}`, {
            method: 'delete',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!result.ok) {
            throw new Error(
                `Error while deleting content: ${result.status} ${
                    result.statusText
                } ${await result.text()}`
            );
        }
    };

    getEdit = async (contentId: string): Promise<IEditorModel> => {
        const token = this.getToken();
        console.log(
            `ContentService: Getting information to edit ${contentId}...`
        );
        const res = await fetch(`${this.baseUrl}/${contentId}/edit`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res || !res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
    };

    getPlay = async (contentId: string): Promise<IPlayerModel> => {
        const token = this.getToken();
        console.log(
            `ContentService: Getting information to play ${contentId}...`
        );
        const res = await fetch(`${this.baseUrl}/${contentId}/play`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res || !res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }
        return res.json();
    };

    list = async (params?: Record<any, any>): Promise<IContentListEntry[]> => {
        const p =
            (params &&
                `${Object.keys(params)
                    .map((i) => {
                        if (i && params[i]) return `${i}=${params[i]}`;
                        return null;
                    })
                    .join('&')}`) ||
            null;
        const url = `${this.baseUrl}${p ? `?${p}` : ''}`;
        const result = await RestfulService.getApi(url);
        return result.data;
    };

    save = async (
        contentId: string,
        requestBody: { library: string; params: any }
    ): Promise<{ contentId: string; metadata: IContentMetadata }> => {
        const token = this.getToken();
        if (contentId) {
            console.log(`ContentService: Saving new content.`);
        } else {
            console.log(`ContentService: Saving content ${contentId}`);
        }

        const body = JSON.stringify(requestBody);

        const res = contentId
            ? await fetch(`${this.baseUrl}/${contentId}`, {
                  method: 'PATCH',
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                  },
                  body,
              })
            : await fetch(this.baseUrl, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                  },
                  body,
              });

        if (!res || !res.ok) {
            throw new Error(
                `${res.status} ${res.statusText} - ${await res.text()}`
            );
        }
        return res.json();
    };
    generateDownloadLink = (contentId: string): string =>
        `${this.baseUrl}/download/${contentId}`;
}
