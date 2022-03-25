export interface IClass {
    id?: number;
    name: string;
    description: string;
    avatar?: string;
    start_date: string;
    end_date: string;
    time_range: { weekday: number; start_time: string; end_time: string }[];
    vc_link: string;
    status?: string;
    time_zone?: string;
}

export type ICreateClassParams = Omit<IClass, 'id' | 'status'>;

export type IGetClassParams = {
    page: number;
    per_page: number;
    q?: string;
};

export type IPatchClassParams = Partial<ICreateClassParams>;

export interface IClassResponse {
    items: IClass[];
    total: number;
    page: number;
    per_page: number;
    sort_by: 'updated_on';
    order: 'asc' | 'desc';
}

export interface IClassAction extends IClassResponse {
    type: string;
}

export interface IClasslistState extends IClassResponse {
    isLoading: boolean;
}

export interface ICLassSession {
    id: number;
    start_time: string;
    end_time: string;
}

export interface IClassSessionResponse {
    items: ICLassSession[];
    total: number;
    page: number;
    per_page: number;
    sort_by: 'updated_on';
    order: 'asc' | 'desc';
}

export type MemberClasses = {
    avatar_url: string;
    display_name: string;
    email: string;
    first_name: string;
    last_name?: string;
    id: number;
    membership: {
        id: number;
        is_creator: boolean;
        role: string;
        status: string;
        user_id: number;
        workspace_id: number;
        last_visited?: string;
        type: string;
    };
    last_visited: string;
};
export interface MembersClassesType {
    items: MemberClasses[];
    page: number;
    per_page: number;
    total: number;
    sort_by: string;
    order: string;
}

export interface IClassSessionAction extends IClassSessionResponse {
    type: string;
}

export interface IClassSessionState extends IClassSessionResponse {}

export type IClassSessionParams = Partial<Omit<IClassSessionResponse, 'item'>>;
