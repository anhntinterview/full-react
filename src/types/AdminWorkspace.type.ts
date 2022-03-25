export type WorkspaceAdminItem = {
    readonly id: number;
    readonly uid: string;
    readonly title: string;
    readonly created_by: { avatar_url: string; display_name: string };
    readonly updated_on: string;
    readonly content_type: string;
};

export type WorkspaceAdminPendingListResponse = {
    readonly items: WorkspaceAdminItem[];
    readonly isLoading: boolean;
    readonly total: number;
    readonly order: 'asc' | 'desc';
    readonly params: ParamsAdmin;
};

export interface GetWorkSpaceAdminAction
    extends WorkspaceAdminPendingListResponse {
    type: string;
}

export interface ParamsAdmin {
    page?: number;
    per_page?: number;
    sort_by?: 'updated_on' | 'created_on' | 'title.keyword';
    order?: 'desc' | 'asc';
    tag_id?: string | number;
    status?: string;
    title?: string;
    created_by?: string;
    uid?: string;
    contentId?: string;
    type?: string;
}
