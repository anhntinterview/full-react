import type {
    IEditorModel,
    IPlayerModel,
    IContentMetadata,
} from 'packages/h5p-server';
import { GetListH5PParams, StatusType } from './ApiData.type';
import { TagType } from './GetListOfWorkspace.type';
export interface IContentService {
    delete(contentId: string): Promise<void>;
    getEdit(contentId: string): Promise<IEditorModel>;
    getPlay(contentId: string): Promise<IPlayerModel>;
    list(params?: GetListH5PParams): Promise<IContentListEntry[]>;
    save(
        contentId: string,
        requestBody: { library: string; params: any }
    ): Promise<{ contentId: string; metadata: IContentMetadata }>;
    generateDownloadLink(contentId: string): string;
}
export interface IH5PContentList {
    items: IContentListEntry[];
    page: number | undefined;
    per_page: number | undefined;
    total: number | undefined;
    // sort_by: string | undefined;
    // order: string | undefined;
    sort_by?: 'updated_on' | 'created_on' | 'title.keyword';
    order?: 'desc' | 'asc';
    title?: string;
    content_type?: string;
}
export interface IContentListEntry {
    contentId: string;
    argsId: IH5PPlayerArgs;
    mainLibrary: string | undefined;
    title: string;
    originalNewKey?: string;
    updated_on?: string;
    status?: string;
    uid?: string;
    tags?: TagType[];
    created_by?: {
        avatar_url?: string;
        display_name?: string;
        email?: string;
        first_name?: string;
        id?: number;
        last_name?: string;
    };
}

export interface ParamsH5P {
    page: number | undefined;
    per_page: number | undefined;
    total: number | undefined;
    sort_by?: 'updated_on' | 'created_on' | 'title.keyword';
    order?: 'desc' | 'asc';
    title?: string;
    content_type?: string[];
    status?: StatusType;
}

export interface H5PFile {
    id: number;
    name: string;
    mimeType: string;
    label: string;
    lastModified: string;
    contentType: string;
}
export interface IH5PState {
    isLoading: boolean;
    h5PApproveContentResult: undefined;
    h5PContentListResult: IH5PContentList | undefined;
    h5PPlayerResult: IPlayerModel | undefined;
    h5PEditorResult: IEditorModel | undefined;
    currentH5P: any | undefined;
    params: ParamsH5P;
    status: string;
    err: undefined;
}

export interface IH5PAction extends IH5PState {
    type: string;
}

export interface IH5PPlayerArgs {
    workspaceId: string;
    contentId: string;
    contentUid?: string;
}

export interface IH5PEditorArgs {
    workspaceId: string;
    contentId: string;
}
export interface H5PFile {
    id: number;
    name: string;
    mimeType: string;
    label: string;
    lastModified: string;
    contentType: string;
}
export interface TagsType {
    tags: TagIdType[];
}

export interface TagIdType {
    tag_id: number;
}
export type FilterLocal = {
    contentType: CheckboxType[];
};

export type CheckboxType = {
    name: string;
    check: boolean;
    id: string | number;
};
