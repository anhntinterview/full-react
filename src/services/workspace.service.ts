import { RestfulService } from './restful.service';
import qs from 'qs';
// CONSTANTS
import { WORKSPACE, HOST_URL } from 'constant/api.const';
// TYPES
import { CreateWorkspaceArgsType } from 'types/CreateWorkspace.type';
import {
    GetListOfWorkspaceBodyType,
    GetWorkspaceDetailArgs,
    LessonResponse,
    TagType,
    WorkspaceItem,
} from 'types/GetListOfWorkspace.type';
import { InviteMembersAgsType } from 'types/InviteMembers.type';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import {
    CourseParam,
    CreateTagBody,
    ApprovalBody,
    TagResponse,
    TagsInBodyType,
    UpdateLessonBody,
    WorkspaceParams,
    UpdateCourseParam,
    AddTagCourseParam,
    CreateCourseParam,
} from 'types/ApiData.type';
import { Key } from 'readline';
import { CourseDetailType, ICourseResponse } from 'types/Courses.type';
import { CreateLessonParam, UpdateLessonParams } from 'types/Lesson.type';
import lodash from 'lodash';

const inviteMembers = async (args: InviteMembersAgsType) => {
    if (args) {
        const { members, workspaceId } = args;
        const removeUnnecessaryAttrMembers = members.map((item) => ({
            email: item.email,
            role: item.role,
        }));
        const res = await RestfulService.postApi(
            HOST_URL + WORKSPACE.INVITE_WORKSPACE(workspaceId),
            { members: removeUnnecessaryAttrMembers }
        );
        if (!!res.data.error) {
            throw res.data;
        }
        return res;
    }
};

const getListOfWorkspace = async () => {
    const res = await RestfulService.getApi(
        HOST_URL + WORKSPACE.GET_CURRENT_USER_OF_WORKSPACE
    );
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const createWorkspace = async (args: CreateWorkspaceArgsType) => {
    if (args) {
        const { name, members, avatar } = args;
        const res = await RestfulService.postApi(
            HOST_URL + WORKSPACE.CREATE_WORKSPACE,
            { name, members, avatar }
        );
        if (!!res.data.error) {
            throw res.data;
        }
        return res.data;
    }
};

const getWorkspaceDetail = async (args: GetWorkspaceDetailArgs) => {
    if (args) {
        const { id } = args;
        const res = await RestfulService.getApi(
            HOST_URL + WORKSPACE.GET_WORKSPACE_DETAIL(id)
        );

        if (!!res.data.error) {
            throw res.data;
        }
        return res.data;
    }
};

const updateWorkspaceInformation = async (
    workspaceId: string,
    params?: WorkspaceParams
): Promise<WorkspaceItem | undefined> => {
    const res = await RestfulService.patchApi(
        `${HOST_URL}/workspaces/${workspaceId}`,
        lodash.omitBy(params, lodash.isEmpty)
    );

    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const getWorkspaceMembers = async (
    args: GetWorkspaceDetailArgs,
    param?: Record<any, any>
) => {
    // ): Promise<WorkspaceMemberResponse | undefined> => {

    if (args) {
        const params =
            (param &&
                `${Object.keys(param)
                    .map((i) => {
                        if (i && param[i]) return `${i}=${param[i]}`;
                        return null;
                    })
                    .join('&')}`) ||
            null;
        const { id } = args;
        const url = `${HOST_URL}/workspaces/${id}/members${
            params ? `?${params}` : ''
        }`;
        const res = await RestfulService.getApi(url);

        if (!!res.data.error) {
            throw res.data;
        }
        return res.data;
    }
};

const updateWorkspaceMembers = async (
    workspaceId: string,
    userId: string,
    body: { role: string; status: string }
) => {
    const req = await RestfulService.putApi(
        `${HOST_URL}/workspaces/${workspaceId}/members/${userId}`,
        {
            ...body,
        }
    );
    if (!!req.data.error) {
        throw req.data.error;
    }
    if (req.status === 204) {
        return true;
    }
};

const getLessonList = async (
    workspaceId: number | string,
    param?: Record<any, any>
) => {
    const params =
        (param &&
            `${Object.keys(param)
                .map((i: any) => `${i}=${param[i]}`)
                .join('&')}`) ||
        null;
    const url = `${HOST_URL}/workspaces/${workspaceId}/lessons${
        params ? `?${params}` : ''
    }`;

    const res = await RestfulService.getApi(url);
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const createlessonTags = async (
    workspaceId: string,
    body: CreateTagBody
): Promise<TagType | undefined> => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/tags`;

    const req = await RestfulService.postApi(url, {
        name: body.name,
        color: JSON.stringify(body.color),
    });
    if (!!req.data.error) {
        throw req.data.error;
    }
    if (req.status === 200) {
        return req.data;
    }
};

const getLessonTags = async (
    workspaceId: string,
    name?: string,
    params?: Record<any, any>
): Promise<TagResponse | null> => {
    const defaultParams = params || 'sort_by=created_on';
    const url = `${HOST_URL}/workspaces/${workspaceId}/tags?${
        name ? `name=${name}&${defaultParams}` : defaultParams
    }`;

    const res = await RestfulService.getApi(url);
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const createLesson = async (workspaceId: string, body?: CreateLessonParam) => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/lessons`;
    const resBody = body || {
        title: 'Untitiled Lesson',
        skill_summary: ' ',
    };

    const res = await RestfulService.postApi(url, resBody);
    if (!!res.data.error) {
        throw res.data;
    }
    return res;
};

const getLessonDetail = async (workspaceId: string, lessonId: string) => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/lessons/${lessonId}`;

    const res = await RestfulService.getApi(url);
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const updateLessonDetail = async (
    workspaceId: string,
    lessonId: string,
    requestBody: UpdateLessonBody
) => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/lessons/${lessonId}`;

    const res = await RestfulService.putApi(url, {
        ...requestBody,
    });
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const updatePartialLesson = async (
    workspaceId: string,
    lessonId: string,
    requestBody: UpdateLessonParams
) => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/lessons/${lessonId}`;

    const res = await RestfulService.patchApi(url, {
        ...requestBody,
    });
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const attachTagsForLesson = async (
    workspaceId: string,
    lessonId: string,
    listTags: TagsInBodyType
) => {
    if (listTags.length) {
        const url = `${HOST_URL}/workspaces/${workspaceId}/lessons/${lessonId}/tags`;
        const body = { tags: listTags };
        const res = await RestfulService.postApi(url, {
            ...body,
        });
        if (!!res.data.error) {
            throw -1;
        }
        return 1;
    }
    return 0;
};

// const attachTagsForLesson = async (
//     workspaceId: string,
//     lessonId: string,
//     listTags: TagsInBodyType
// ) => {
//     if (listTags.length) {
//         const url = `${HOST_URL}/workspaces/${workspaceId}/lessons/${lessonId}/tags`;
//         const body = { tags: listTags };
//         const res = await RestfulService.postApi(url, {
//             ...body,
//         });
//         if (!!res.data.error) {
//             throw res.data;
//         }
//         return true;
//     }
// };

const detachTagsForLesson = async (
    workspaceId: string,
    lessonId: string,
    tagId: number
) => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/lessons/${lessonId}/tags/${tagId}`;

    const res = await RestfulService.deleteApi(url);
    if (!!res.data.error) {
        throw res.data;
    }
    return true;
};

const detachManyTagsForLesson = async (
    workspaceId: string,
    lessonId: string,
    listTags: TagsInBodyType
) => {
    if (listTags.length) {
        const url = `${HOST_URL}/workspaces/${workspaceId}/lessons/${lessonId}/tags`;
        const body = { tags: listTags };
        const res = await RestfulService.deleteApi(url, {
            ...body,
        });
        if (!!res.data.error) {
            throw -1;
        }
        return 1;
    }
    return 0;
};

const createLessonApproval = async (
    workspaceId: string,
    lessonId: string,
    body: ApprovalBody
) => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/lessons/${lessonId}/approval`;

    const res = await RestfulService.postApi(url, body);
    if (!!res.data.error) {
        throw res.data;
    }
    return true;
};

const cancelLessonApproval = async (workspaceId: string, lessonId: string) => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/lessons/${lessonId}/approval`;

    const res = await RestfulService.deleteApi(url);
    if (!!res.data.error) {
        throw res.data;
    }
    return true;
};

const approveLessonApproval = async (workspaceId: string, lessonId: string) => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/lessons/${lessonId}/approve`;

    const res = await RestfulService.postApi(url);
    if (!!res.data.error) {
        throw res.data;
    }
    return true;
};

//move lesson to trash
const removeLesson = async (workspaceId: string, lessonId: string) => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/lessons/${lessonId}/trash`;

    const res = await RestfulService.postApi(url);
    if (!!res.data.error) {
        throw res.data;
    }
    return true;
};

//recover from trash
const recoverLesson = async (workspaceId: string, lessonId: string) => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/lessons/${lessonId}/recover`;
    console.log('reqrqer');

    const res = await RestfulService.postApi(url);
    if (!!res.data.error) {
        throw res.data;
    }
    return true;
};

const getPendingAdminList = async (
    workspaceId: string,
    order: 'asc' | 'desc',
    page: number,
    perPage?: number
) => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/contents?status=pending&sort_by=updated_on&page=${page}&per_page=${
        perPage || 10
    }&order=${order}`;

    const res = await RestfulService.getApi(url);
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const getAdminList = async (workspaceId: string, params?: Record<any, any>) => {
    const p: string[] = [];
    if (params) {
        Object.keys(params).forEach((i) => {
            if (i && params[i]) {
                p.push(`${i}=${params[i]}`);
            }
        });
    }
    const url = `${HOST_URL}/workspaces/${workspaceId}/contents${
        p ? `?${p.join('&')}` : ''
    }`;

    const res = await RestfulService.getApi(url);
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const approvePendingItem = async (
    workspaceId: string,
    type: 'lesson' | 'course' | 'h5p_content',
    id: number
) => {
    switch (type) {
        case 'lesson':
            const lessRes = await RestfulService.postApi(
                `${HOST_URL}/workspaces/${workspaceId}/lessons/${id}/approve`
            );
            if (lessRes.status === 204) {
                return true;
            }
            if (!!lessRes.data.error) {
                throw lessRes.data.error;
            }
            return false;
        case 'h5p_content':
            const h5PRes = await RestfulService.postApi(
                `${HOST_URL}/h5p/workspaces/${workspaceId}/${id}/approve`
            );
            if (!!h5PRes.data.error) {
                throw h5PRes.data.error;
            }

            return true;

        case 'course':
            const courseRes = await RestfulService.postApi(
                `${HOST_URL}/workspaces/${workspaceId}/courses/${id}/approve`
            );
            if (!!courseRes.data.error) {
                throw courseRes.data.error;
            }
            return true;

        default:
            break;
    }
    return false;
};

const declinePendingItem = async (
    workspaceId: string,
    type: 'lesson' | 'course' | 'h5p_content',
    id: number
) => {
    switch (type) {
        case 'lesson':
            const lessRes = await RestfulService.deleteApi(
                `${HOST_URL}/workspaces/${workspaceId}/lessons/${id}/approval`
            );
            if (!!lessRes.data.error) {
                throw lessRes.data.error;
            }
            if (lessRes.status === 204) {
                return true;
            }
            return false;
        case 'h5p_content':
            const h5PRes = await RestfulService.deleteApi(
                `${HOST_URL}/h5p/workspaces/${workspaceId}/${id}/approval`
            );
            if (!!h5PRes.data.error) {
                throw h5PRes.data.error;
            }
            if (h5PRes.status === 204) {
                return true;
            }
            return false;
        case 'course':
            const courseRes = await RestfulService.deleteApi(
                `${HOST_URL}/workspaces/${workspaceId}/courses/${id}/approval`
            );
            if (!!courseRes.data.error) {
                throw courseRes.data.error;
            }
            if (courseRes.status === 204) {
                return true;
            }
            return false;
        default:
            break;
    }
};

//courses
const getCoursesList = async (workspaceId: string, params?: CourseParam) => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/courses${
        params ? `?${qs.stringify(params)}` : ''
    }`;

    const res = await RestfulService.getApi(url);
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const getCourseDetail = async (
    workspaceId: string | number,
    courseId: string | number
) => {
    if (courseId) {
        const url = `${HOST_URL}/workspaces/${workspaceId}/courses/${courseId}`;

        const res = await RestfulService.getApi(url);
        if (!!res.data.error) {
            throw res.data;
        }
        return res.data;
    }
};

const updateCourseDetail = async (
    workspaceId: string | number,
    courseId: string | number,
    params?: UpdateCourseParam
): Promise<CourseDetailType> => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/courses/${courseId}`;

    const res = await RestfulService.patchApi(url, params);
    if (!!res.data.error) {
        throw res.data;
    }
    return res.data;
};

const attachCourseTags = async (
    workspaceId: string | number,
    courseId: string | number,
    params?: AddTagCourseParam
) => {
    if (params.tags.length) {
        const url = `${HOST_URL}/workspaces/${workspaceId}/courses/${courseId}/tags`;

        const res = await RestfulService.postApi(url, params);
        if (!!res.data.error) {
            throw -1;
        }
        return 1;
    }
    return 0;
};

// const attachCourseTags = async (
//     workspaceId: string | number,
//     courseId: string | number,
//     params?: AddTagCourseParam
// ): Promise<boolean> => {
//     const url = `${HOST_URL}/workspaces/${workspaceId}/courses/${courseId}/tags`;

//     const res = await RestfulService.postApi(url, params);
//     if (!!res.data.error) {
//         throw res.data;
//     }
//     return res.data;
// };

const detachCourseTag = async (
    workspaceId: string | number,
    courseId: string | number,
    tagId: number
): Promise<boolean> => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/courses/${courseId}/tags/${tagId}`;

    const res = await RestfulService.deleteApi(url);
    if (!!res.data.error) {
        throw res.data;
    }
    return true;
};

const detachCourseManyTags = async (
    workspaceId: string | number,
    courseId: string | number,
    params?: AddTagCourseParam
) => {
    if (params.tags.length) {
        const url = `${HOST_URL}/workspaces/${workspaceId}/courses/${courseId}/tags`;
        const res = await RestfulService.deleteApi(url, params);
        if (!!res.data.error) {
            throw -1;
        }
        return 1;
    }
    return 0;
};

const createCourseApproval = async (
    workspaceId: string | number,
    courseId: string | number,
    approvalBody: {
        user_id: number;
        message: string;
    }
): Promise<boolean> => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/courses/${courseId}/approval`;

    const res = await RestfulService.postApi(url, approvalBody);
    if (!!res.data.error) {
        throw res.data;
    }
    return true;
};

const approveCourse = async (
    workspaceId: string | number,
    courseId: string | number
): Promise<boolean> => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/courses/${courseId}/approve`;

    const req = await RestfulService.postApi(url);
    if (req.status === 204) {
        return true;
    } else throw new Error('Operation failed, please try again!');
};
const declineCourse = async (
    workspaceId: string | number,
    courseId: string | number
): Promise<boolean> => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/courses/${courseId}/approval`;

    const req = await RestfulService.deleteApi(url);
    if (!!req.data.error) {
        throw req.data.error;
    }
    return true;
};

const createNewCourse = async (
    workspaceId: string | number,
    body: CreateCourseParam
): Promise<CourseDetailType | undefined> => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/courses`;

    const req = await RestfulService.postApi(url, {
        ...body,
    });
    if (!!req.data.error) {
        throw req.data.error;
    }
    return req.data;
};

const moveCourseToTrash = async (
    workspaceId: string | number,
    courseId: string | number
): Promise<boolean> => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/courses/${courseId}/trash`;

    const req = await RestfulService.postApi(url);
    if (!!req.data.error) {
        throw req.data.error;
    }
    if (req.status === 204) {
        return true;
    }
};

const recoverCourseFromTrash = async (
    workspaceId: string | number,
    courseId: string | number
): Promise<boolean> => {
    const url = `${HOST_URL}/workspaces/${workspaceId}/courses/${courseId}/recover`;

    const req = await RestfulService.postApi(url);
    if (!!req.data.error) {
        throw req.data.error;
    }
    if (req.status === 204) {
        return true;
    }
};

const getClassesMembers = async (
    workspaceId: string,
    classId: string,
    param?: Record<any, any>
) => {
    if (workspaceId) {
        const params =
            (param &&
                `${Object.keys(param)
                    .map((i) => {
                        if (i && param[i]) return `${i}=${param[i]}`;
                        return null;
                    })
                    .join('&')}`) ||
            null;
        const url = `${HOST_URL}/workspaces/${workspaceId}/classes/${classId}/members${
            params ? `?${params}` : ''
        }`;
        const res = await RestfulService.getApi(url);

        if (!!res.data.error) {
            throw res.data.error;
        }
        return res.data;
    }
};

export default {
    declinePendingItem,
    approvePendingItem,
    getPendingAdminList,
    inviteMembers,
    getListOfWorkspace,
    createWorkspace,
    getWorkspaceDetail,
    updateWorkspaceInformation,
    getWorkspaceMembers,
    updateWorkspaceMembers,
    createlessonTags,
    getLessonList,
    getLessonTags,
    createLesson,
    getLessonDetail,
    updateLessonDetail,
    updatePartialLesson,
    attachTagsForLesson,
    detachTagsForLesson,
    createLessonApproval,
    cancelLessonApproval,
    approveLessonApproval,
    removeLesson,
    recoverLesson,
    getCoursesList,
    getCourseDetail,
    getAdminList,
    updateCourseDetail,
    attachCourseTags,
    detachCourseTag,
    createCourseApproval,
    approveCourse,
    declineCourse,
    createNewCourse,
    moveCourseToTrash,
    recoverCourseFromTrash,
    detachManyTagsForLesson,
    detachCourseManyTags,
    getClassesMembers,
};
