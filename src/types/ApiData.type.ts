import { LessonSection, TagType } from './GetListOfWorkspace.type';

export type StatusType = 'draft' | 'pending' | 'public' | 'archive' | 'trash';
export type SortType =
    | 'updated_on'
    | 'published_on'
    | 'created_on'
    | 'title.keyword';

export type HeaderNavItemType = {
    id?: number;
    name: string;
    description?: string;
    href: string;
    icon?: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
};

export type HeaderNavListType = HeaderNavItemType[];

export type ListParam = {
    page?: number;
    per_page?: number;
    sort_by?: 'updated_on' | 'created_on' | 'title.keyword';
    order?: 'desc' | 'asc';
    tag_id?: string | number;
    status?: StatusType;
    title?: string;
    created_by?: string;
    uid?: string;
    contentId?: string;
    contentType?: string;
};

export type TagResponse = {
    items: TagType[];
};

export type CreateTagBody = {
    name: string;
    color: {
        backgroundColor: string;
        textColor: string;
    };
};

export type TagsInBodyType = { tag_id: number }[];

export type UpdateLessonBody = {
    title: string;
    skill_summary: string;
    sections?: LessonSection[];
    point?: number;
};

export type GetMemberParams = {
    role?: 'admin' | 'member';
    email?: string;
    q?: string;
    per_page?: number;
    page?: number;
    status?: 'active' | 'deactivate' | 'invite';
};

export type ApprovalBody = {
    user_id: string;
    message?: string;
};

export type GetListH5PParams = {
    title?: string;
    page?: number;
};

export type WorkspaceParams = {
    name?: string;
    email?: string;
    description?: string;
    phone?: string;
    address?: string;
    avatar?: string;
    drive_default_path?: string;
};

export type CourseParam = {
    title?: string;
    status?: StatusType;
    uid?: string;
    tag_id?: string;
    created_by?: string;
    sort_by?: 'updated_on' | 'published_on' | 'created_on' | 'title.keyword';
    page?: number;
    per_page?: number;
    order?: 'desc' | 'asc';
};

export type UpdateCourseParam = {
    title?: string;
    level?: string;
    requirements?: string;
    thumbnail?: string;
    duration?: string;
    result?: string;
    short_description?: string;
    full_description?: string;
    type?: 'online' | 'offline' | 'online_and_offline';
    lessons?: { lesson_uid: string }[];
    tags?: { tag_id: number }[];
};

export type CreateCourseParam = UpdateCourseParam;

export type AddTagCourseParam = {
    tags: { tag_id: number }[];
};
