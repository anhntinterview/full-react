import { LessonSection } from './GetListOfWorkspace.type';

export type SectionState = {
    title: string;
    description: string;
    files: SectionFile[];
};

export type SectionFile = {
    uid: string;
    file_name: string;
    file_url: string;
    file_mimetype: string;
    main_library?: string;
};

export type LessonFilterLocal = {
    authors: CheckboxType[];
    tags: CheckboxType[];
};

export type CheckboxType = {
    name: string;
    check: boolean;
    id: string | number;
};

export type CreateLessonParam = {
    title?: string;
    skill_summary?: string;
    thumbnail?: string;
    point?: number;
    callborators?: { user_id: number }[];
    tags?: { tag_id: number }[];
};

export type UpdateLessonParams = {
    title?: string;
    thumbnail?: string;
    points?: number;
    skill_summary?: string;
    sections?: LessonSection[];
};
