// ACTION
import React from 'react';
import { toast } from 'react-toastify';
import {
    CLASSES_INVITE,
    GET_WORKSPACE_DETAIL,
    SET_CREATE_WORKSPACE,
    SET_GET_CURRENT_USER_WORKSPACE,
    SET_INVITE_MEMBERS,
    WORKSPACE_ADMIN,
    WORKSPACE_COURSES,
    WORKSPACE_LESSON,
    WORKSPACE_SETTING,
    WORKSPACE_TAG,
    WORKSPACE_USER_DETAIL,
} from 'actions/workspace.action';
// SERVICE
import { UserService, WorkspaceService } from 'services';
import {
    GetMemberParams,
    ListParam,
    CourseParam,
    UpdateCourseParam,
    AddTagCourseParam,
    WorkspaceParams,
} from 'types/ApiData.type';
// TYPE
import {
    CreateWorkspaceAction,
    CreateWorkspaceArgsType,
} from 'types/CreateWorkspace.type';
import {
    GetListOfWorkspaceBodyType,
    GetWorkspaceDetailArgs,
    LessonInterface,
    MemberInviteType,
    TagType,
} from 'types/GetListOfWorkspace.type';
import { InviteMembersAgsType } from 'types/InviteMembers.type';
import {
    GetWorkSpaceAdminAction,
    ParamsAdmin,
} from 'types/AdminWorkspace.type';
import { initCourseList } from 'state/Workspace/workspace.state';
import { CourseDetailType, CourseType } from 'types/Courses.type';
import { UpdateLessonParams } from 'types/Lesson.type';
import {
    IClassSessionParams,
    IClassSessionState,
    ICreateClassParams,
    IGetClassParams,
    IPatchClassParams,
} from 'types/Class.type';
import { CLASS_LIST } from 'actions/class.action';
import classService from 'services/class.service';
import { FORM_CONST } from 'constant/form.const';

const createWorkspace = async (
    dispatch: React.Dispatch<CreateWorkspaceAction>,
    args: CreateWorkspaceArgsType
) => {
    dispatch(<CreateWorkspaceAction>{
        type: SET_CREATE_WORKSPACE.REQ_CREATE_WORKSPACE,
    });
    try {
        let _path: string | undefined;
        if (args.avatar && args.avatar instanceof File) {
            await UserService.uploadImage(
                args.avatar as File,
                (path) => (_path = path),
                (error) => {
                    dispatch(<CreateWorkspaceAction>{
                        type: SET_CREATE_WORKSPACE.REQ_CREATE_WORKSPACE_FAIL,
                        err: error,
                    });
                }
            );
        }

        WorkspaceService.createWorkspace({
            ...args,
            avatar: _path,
        })
            .then((result) => {
                if (result.error) {
                    dispatch(<CreateWorkspaceAction>{
                        type: SET_CREATE_WORKSPACE.REQ_CREATE_WORKSPACE_FAIL,
                        err: result,
                    });
                    return;
                }
                dispatch(<CreateWorkspaceAction>{
                    type: SET_CREATE_WORKSPACE.REQ_CREATE_WORKSPACE_SUCCESS,
                    result,
                });
            })
            .catch((error) => {
                dispatch(<CreateWorkspaceAction>{
                    type: SET_CREATE_WORKSPACE.REQ_CREATE_WORKSPACE_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch(<CreateWorkspaceAction>{
            type: SET_CREATE_WORKSPACE.REQ_CREATE_WORKSPACE_FAIL,
            err: err.toJSON().message,
        });
    }
};

const getListOfWorkspace = (dispatch: React.Dispatch<any>) => {
    dispatch({
        type: SET_GET_CURRENT_USER_WORKSPACE.REQ_GET_CURRENT_USER_WORKSPACE,
    });
    try {
        WorkspaceService.getListOfWorkspace()
            .then((result) => {
                // if (result.error) {
                //     dispatch({
                //         type:
                //             SET_GET_CURRENT_USER_WORKSPACE.REQ_GET_CURRENT_USER_WORKSPACE_FAIL,
                //         err: result,
                //     });
                // }
                // if (result.validation_error) {
                //     dispatch({
                //         type:
                //             SET_GET_CURRENT_USER_WORKSPACE.REQ_GET_CURRENT_USER_WORKSPACE_FAIL,
                //         validateErr: result,
                //     });
                // }
                dispatch({
                    type:
                        SET_GET_CURRENT_USER_WORKSPACE.REQ_GET_CURRENT_USER_WORKSPACE_SUCCESS,
                    result,
                });
            })
            .catch((error) => {
                dispatch({
                    type:
                        SET_GET_CURRENT_USER_WORKSPACE.REQ_GET_CURRENT_USER_WORKSPACE_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type:
                SET_GET_CURRENT_USER_WORKSPACE.REQ_GET_CURRENT_USER_WORKSPACE_FAIL,
            err: err.toJSON().message,
        });
    }
};

const inviteMembers = (
    dispatch: React.Dispatch<any>,
    args: InviteMembersAgsType
) => {
    dispatch({ type: SET_INVITE_MEMBERS.REQ_INVITE_MEMBERS });
    try {
        WorkspaceService.inviteMembers(args)
            .then((result) => {
                dispatch({
                    type: SET_INVITE_MEMBERS.REQ_INVITE_MEMBERS_SUCCESS,
                    result,
                });
                // rs.then((r) => {
                //     if (r.error) {
                //         dispatch({
                //             type:
                //                 SET_INVITE_MEMBERS.REQ_INVITE_MEMBERS_FAIL,
                //             err: r,
                //         });
                //     }
                //     if (r.validation_error) {
                //         dispatch({
                //             type:
                //                 SET_INVITE_MEMBERS.REQ_INVITE_MEMBERS_FAIL,
                //             valErr: r,
                //         });
                //     }
                // });
            })
            .catch((error) => {
                dispatch({
                    type: SET_INVITE_MEMBERS.REQ_INVITE_MEMBERS_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_INVITE_MEMBERS.REQ_INVITE_MEMBERS_FAIL,
            err: err.toJSON().message,
        });
    }
};

const resetUserState = (dispatch: React.Dispatch<any>) =>
    dispatch({ type: GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_DETAIL });

const getWorkspace = (
    dispatch: React.Dispatch<any>,
    args: GetWorkspaceDetailArgs
) => {
    dispatch({ type: GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_DETAIL });
    try {
        WorkspaceService.getWorkspaceDetail(args)
            .then((result) => {
                if (result) {
                    dispatch({
                        type:
                            GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_DETAIL_SUCCESS,
                        result,
                    });
                }
            })
            .catch((error) => {
                dispatch({
                    type: GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_DETAIL_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_DETAIL_FAIL,
            err: err.toJson().message,
        });
    }
};

const resetWorkspaceDetailError = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: GET_WORKSPACE_DETAIL.RESET_GET_WORKSPACE_FAIL });
};

const getWorkspaceMembers = (
    dispatch: React.Dispatch<any>,
    args: GetWorkspaceDetailArgs,
    params?: GetMemberParams
) => {
    dispatch({ type: GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_MEMBERS });
    try {
        WorkspaceService.getWorkspaceMembers(args, params)
            .then((result) => {
                if (result) {
                    dispatch({
                        type:
                            GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_MEMBERS_SUCCESS,
                        result,
                    });
                    // rs.then((r) => {
                    //     if (result.status === 200) {
                    //         dispatch({
                    //             type:
                    //                 GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_MEMBERS_SUCCESS,
                    //             result: r,
                    //         });
                    //     }
                    //     if (result.status === 204) {
                    //         dispatch({
                    //             type:
                    //                 GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_MEMBERS_SUCCESS,
                    //             result: result.status,
                    //         });
                    //     }
                    //     if (r.error) {
                    //         dispatch({
                    //             type:
                    //                 GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_MEMBERS_FAIL,
                    //             err: r,
                    //         });
                    //     }
                    //     if (r.validation_error) {
                    //         dispatch({
                    //             type:
                    //                 GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_MEMBERS_FAIL,
                    //             valErr: r,
                    //         });
                    //     }
                    // });
                }
            })
            .catch((error) => {
                dispatch({
                    type: GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_MEMBERS_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_MEMBERS_FAIL,
            err: err.toJson().message,
        });
    }
    // try {
    //     WorkspaceService.getWorkspaceMembers(args).then((result) => {
    //         dispatch({
    //             type: GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_MEMBERS_SUCCESS,
    //             result,
    //         });
    //     });
    // } catch (err) {
    //     dispatch({
    //         type: GET_WORKSPACE_DETAIL.REQ_GET_WORKSPACE_MEMBERS_FAIL,
    //         err: err.toJson().message,
    //     });
    // }
};

const setWorkspaceId = (dispatch: React.Dispatch<any>, id: number) => {
    dispatch({ type: GET_WORKSPACE_DETAIL.REQ_SET_WORKSPACE_ID, id });
};

const removeWorkspaceId = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: GET_WORKSPACE_DETAIL.REQ_REMOVE_WORKSPACE_ID });
};

const setUserRole = (dispatch: React.Dispatch<any>, role: string) => {
    dispatch({ type: WORKSPACE_USER_DETAIL.REQ_SET_USER_ROLE, role });
};

const setUserWorkspaceCreator = (
    dispatch: React.Dispatch<any>,
    isCreator: boolean
) => {
    dispatch({ type: WORKSPACE_USER_DETAIL.REQ_SET_USER_CREATOR, isCreator });
};

const setWorkspaceDriveId = (
    dispatch: React.Dispatch<any>,
    workspaceDriveId: string
) => {
    dispatch({
        type: WORKSPACE_USER_DETAIL.REQ_SET_WORKSPACE_DRIVE_ID,
        workspaceDriveId,
    });
};

const setCurrentUploadNavigation = (
    dispatch: React.Dispatch<any>,
    currentPath: number
) => {
    dispatch({
        type: GET_WORKSPACE_DETAIL.REQ_SET_CURRENT_UPLOAD_NAVIGATION,
        currentPath,
    });
};

const getLessonList = (
    dispatch: React.Dispatch<any>,
    workspaceId: number | string,
    param?: ListParam
) => {
    dispatch({ type: WORKSPACE_LESSON.REQ_GET_LESSON_LIST_LOADING });
    WorkspaceService.getLessonList(workspaceId, param)
        .then((res) => {
            dispatch({
                type: WORKSPACE_LESSON.REQ_GET_LESSON_LIST_SUCCESS,
                lessonList: res,
            });
        })
        .catch((err) =>
            dispatch({
                type: WORKSPACE_LESSON.REQ_GET_LESSON_LIST_FAIL,
                lessonListError: err,
            })
        );
};

const getPendingAdminList = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    order: 'asc' | 'desc',
    page: number
) => {
    dispatch({ type: WORKSPACE_ADMIN.REQ_GET_ADMIN_LIST });
    WorkspaceService.getPendingAdminList(workspaceId, order, page)
        .then((res) => {
            dispatch({
                type: WORKSPACE_ADMIN.REQ_GET_ADMIN_LIST_FINISH,
                items: res.items,
                total: res.total,
            } as GetWorkSpaceAdminAction);
        })
        .catch((err) =>
            dispatch({
                type: WORKSPACE_ADMIN.REQ_GET_ADMIN_LIST_ERROR,
            })
        );
};

const getAdminList = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    params?: ParamsAdmin
) => {
    dispatch({ type: WORKSPACE_ADMIN.REQ_GET_ADMIN_LIST });
    WorkspaceService.getAdminList(workspaceId, params)
        .then((res) => {
            dispatch({
                type: WORKSPACE_ADMIN.REQ_GET_ADMIN_FILTER,
                items: res.items,
                params: params,
                total: res.total,
            } as GetWorkSpaceAdminAction);
        })
        .catch((err) =>
            dispatch({
                type: WORKSPACE_ADMIN.REQ_GET_ADMIN_LIST_ERROR,
            })
        );
};

const handleTagAction = (
    dispatch: React.Dispatch<any>,
    addStatus: number,
    deleteStatus: number
) => {
    if (addStatus !== 0 || deleteStatus !== 0) {
        if (addStatus === 1 && deleteStatus === 1) {
            dispatch({
                type: WORKSPACE_TAG.REQ_UPDATE_TAG_FINISH,
            });
        } else if (addStatus === -1 || deleteStatus === -1) {
            if (addStatus === -1 && deleteStatus === -1) {
                dispatch({
                    type: WORKSPACE_TAG.REQ_UPDATE_TAG_FAILED,
                });
            } else if (addStatus === -1) {
                dispatch({
                    type: WORKSPACE_TAG.REQ_UPDATE_TAG_ADD_FAILED,
                });
            } else if (deleteStatus === -1) {
                dispatch({
                    type: WORKSPACE_TAG.REQ_UPDATE_TAG_REMOVE_FAILED,
                });
            }
        }
    }
    if (
        (addStatus === 1 && deleteStatus === 0) ||
        (addStatus === 0 && deleteStatus === 1)
    ) {
        dispatch({
            type: WORKSPACE_TAG.REQ_UPDATE_TAG_FINISH,
        });
    }
};

const adminApprove = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    order: 'asc' | 'desc',
    type: 'lesson' | 'course' | 'h5p_content',
    id: number
) => {
    dispatch({ type: WORKSPACE_ADMIN.REQ_ADMIN_APPROVE });
    let success = false;
    WorkspaceService.approvePendingItem(workspaceId, type, id)
        .then((res) => {
            if (res) {
                WorkspaceService.getPendingAdminList(workspaceId, order, 1, 11)
                    .then((res) => {
                        const items = res.items;
                        const found = items.some((item: any) => item.id === id);
                        dispatch({
                            type: WORKSPACE_ADMIN.REQ_GET_ADMIN_LIST_FINISH,
                            items: found
                                ? items.filter((item: any) => item.id !== id)
                                : items.slice(0, 10),
                            total: found ? res.total - 1 : res.total,
                        } as GetWorkSpaceAdminAction);
                    })
                    .catch((err) => {
                        //
                    });
            } else {
                dispatch({
                    type: WORKSPACE_ADMIN.REQ_ADMIN_APPROVE_ERROR,
                });
            }
        })
        .catch((err) =>
            dispatch({
                type: WORKSPACE_ADMIN.REQ_ADMIN_APPROVE_ERROR,
            })
        );
    return success;
};

const adminDecline = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    order: 'asc' | 'desc',
    type: 'lesson' | 'course' | 'h5p_content',
    id: number
) => {
    dispatch({ type: WORKSPACE_ADMIN.REQ_ADMIN_DECLINE });
    let success = false;
    WorkspaceService.declinePendingItem(workspaceId, type, id)
        .then((res) => {
            if (res) {
                success = true;
                WorkspaceService.getPendingAdminList(workspaceId, order, 1, 11)
                    .then((res) => {
                        const items = res.items;
                        const found = items.some((item: any) => item.id === id);
                        dispatch({
                            type: WORKSPACE_ADMIN.REQ_GET_ADMIN_LIST_FINISH,
                            items: found
                                ? items.filter((item: any) => item.id !== id)
                                : items.slice(0, 10),
                            total: found ? res.total - 1 : res.total,
                        } as GetWorkSpaceAdminAction);
                    })
                    .catch((err) => {
                        //
                    });
            } else {
                dispatch({
                    type: WORKSPACE_ADMIN.REQ_ADMIN_DECLINE_ERROR,
                });
            }
        })
        .catch((err) =>
            dispatch({
                type: WORKSPACE_ADMIN.REQ_ADMIN_DECLINE_ERROR,
            })
        );
    return success;
};

const setCurrentLesson = (
    dispatch: React.Dispatch<any>,
    lesson: LessonInterface | undefined
) => {
    dispatch({
        type: WORKSPACE_LESSON.REQ_SET_CURRENT_LESSON,
        currentLesson: lesson,
    });
};

const getLessonTags = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    e?: string
) => {
    dispatch({ type: WORKSPACE_LESSON.REQ_GET_LESSON_TAG });
    WorkspaceService.getLessonTags(workspaceId, e)
        .then((res) => {
            dispatch({
                type: WORKSPACE_LESSON.REQ_GET_LESSON_TAG_FINISH,
                tagList: res,
            });
        })
        .catch((err) => {
            toast.error(err.message);
        });
};

const getLessonDetail = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    lessonId: string
) => {
    dispatch({ type: WORKSPACE_LESSON.REQ_SET_CURRENT_LESSON_INIT });
    WorkspaceService.getLessonDetail(workspaceId, lessonId)
        .then((res) => {
            dispatch({
                type: WORKSPACE_LESSON.REQ_SET_CURRENT_LESSON,
                currentLesson: res,
            });
        })
        .catch(() => {
            dispatch({
                type: WORKSPACE_LESSON.REQ_SET_CURRENT_LESSON,
                currentLesson: undefined,
            });
        });
};

const updateLessonDetail = async (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    lessonId: string,
    body: UpdateLessonParams,
    tags: { attachTags: AddTagCourseParam; detachTags: number[] }
) => {
    dispatch({ type: WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL });
    let deleteTags: AddTagCourseParam = {
        tags: [],
    };
    // WorkspaceService.updatePartialLesson(workspaceId, lessonId, body)
    //     .then((res) => {
    //         dispatch({
    //             type: WORKSPACE_LESSON.REQ_SET_CURRENT_LESSON,
    //             currentLesson: res,
    //         });
    //         dispatch({
    //             type: WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL_FINISH,
    //         });
    //     })
    //     .catch(() => {
    //         dispatch({ type: WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL_ERROR });
    //     });

    //new
    const { attachTags, detachTags } = tags;
    dispatch({
        type: WORKSPACE_COURSES.REQ_UPDATE_COURSE_DETAIL,
    });
    const listRequest: Promise<any>[] = [];

    let addStatus = 0;
    let deleteStatus = 0;

    if (detachTags.length) {
        detachTags.forEach((i) => {
            const tagId = {
                tag_id: i,
            };
            deleteTags.tags.push(tagId);
        });
    }

    await WorkspaceService.attachTagsForLesson(
        workspaceId,
        lessonId,
        attachTags.tags
    )
        .then(async (res) => {
            addStatus = res;
            await WorkspaceService.detachManyTagsForLesson(
                workspaceId,
                lessonId,
                deleteTags.tags
            )
                .then((res) => {
                    deleteStatus = res;
                })
                .catch((error) => {
                    deleteStatus = error;
                });
        })
        .catch(async (error) => {
            addStatus = error;
            await WorkspaceService.detachManyTagsForLesson(
                workspaceId,
                lessonId,
                deleteTags.tags
            )
                .then((res) => {
                    deleteStatus = res;
                })
                .catch((error) => {
                    deleteStatus = error;
                });
        });

    // if (attachTags.tags.length) {
    //     listRequest.push(
    //         WorkspaceService.attachTagsForLesson(
    //             workspaceId,
    //             lessonId,
    //             attachTags.tags
    //         ).catch(() => {
    //             throw new Error('tags_error');
    //         })
    //     );
    // }
    // if (detachTags.length) {
    //     detachTags.forEach((i) =>
    //         listRequest.push(
    //             WorkspaceService.detachTagsForLesson(
    //                 workspaceId,
    //                 lessonId,
    //                 i
    //             ).catch(() => {
    //                 throw new Error('tags_error');
    //             })
    //         )
    //     );
    // }

    if (Object.keys(body).length) {
        // listRequest.push(
        //     WorkspaceService.updatePartialLesson(workspaceId, lessonId, body)
        // );
        WorkspaceService.updatePartialLesson(workspaceId, lessonId, body)
            .then((res) => {
                setTimeout(() => {
                    dispatch({
                        type: WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL_FINISH,
                        currentLesson: res,
                    });
                }, 1000);
            })
            .catch(() => {
                setTimeout(() => {
                    dispatch({
                        type: WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL_ERROR,
                    });
                }, 1000);
            });
    } else {
        if (addStatus !== 0 || deleteStatus !== 0) {
            if (addStatus === 1 && deleteStatus === 1) {
                dispatch({
                    type: WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL_FINISH,
                });
            } else if (addStatus === -1 || deleteStatus === -1) {
                if (addStatus === -1 && deleteStatus === -1) {
                    dispatch({
                        type: WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL_ERROR,
                    });
                } else if (addStatus === -1) {
                    dispatch({
                        type: WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL_ERROR,
                    });
                } else if (deleteStatus === -1) {
                    dispatch({
                        type: WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL_ERROR,
                    });
                }
            }
        }
        if (
            (addStatus === 1 && deleteStatus === 0) ||
            (addStatus === 0 && deleteStatus === 1)
        ) {
            dispatch({
                type: WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL_FINISH,
            });
        }
    }

    // Promise.all(listRequest)
    //     .then((res) => {
    //         let updatedLesson = {};
    //         if (res.length && res[0]) {
    //             updatedLesson = res[0];
    //         }
    //         setTimeout(() => {
    //             dispatch({
    //                 type: WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL_FINISH,
    //                 currentLesson: updatedLesson,
    //             });
    //         }, 1000);
    //     })
    //     .catch(() => {
    //         setTimeout(() => {
    //             dispatch({
    //                 type: WORKSPACE_LESSON.REQ_UPDATE_LESSON_DETAIL_ERROR,
    //             });
    //         }, 1000);
    //     });
};

const getCoursesList = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    params?: CourseParam
) => {
    dispatch({ type: WORKSPACE_COURSES.REQ_GET_COURSES_LIST });
    WorkspaceService.getCoursesList(workspaceId, params)
        .then((res) => {
            if (res) {
                dispatch({
                    type: WORKSPACE_COURSES.REQ_GET_COURSES_LIST_FINISH,
                    course: res,
                });
            }
        })
        .catch(() => {
            dispatch({
                type: WORKSPACE_COURSES.REQ_GET_COURSES_LIST_FINISH,
                course: initCourseList,
            });
        });
};

const getCourseDetail = (
    dispatch: React.Dispatch<any>,
    workspaceId: string | number,
    courseId: string | number,
    courseBasicInformation?: CourseType
) => {
    dispatch({
        type: WORKSPACE_COURSES.REQ_GET_COURSE_DETAIL,
        value: courseBasicInformation || {},
    });
    WorkspaceService.getCourseDetail(workspaceId, courseId)
        .then((res) => {
            if (res) {
                dispatch({
                    type: WORKSPACE_COURSES.REQ_GET_COURSES_DETAIL_FINISH,
                    value: res,
                });
            }
        })
        .catch(() => {
            dispatch({
                type: WORKSPACE_COURSES.REQ_GET_COURSES_DETAIL_FINISH,
                value: {},
            });
        });
};

export const updateDetailCourse = async (
    dispatch: React.Dispatch<any>,
    workspaceId: string | number,
    courseId: string | number,
    params: UpdateCourseParam,
    tags: { attachTags: AddTagCourseParam; detachTags: number[] }
) => {
    const { attachTags, detachTags } = tags;
    let addStatus = 0;
    let deleteStatus = 0;
    dispatch({
        type: WORKSPACE_COURSES.REQ_UPDATE_COURSE_DETAIL,
    });
    const listRequest: Promise<any>[] = [];
    let deleteTags: AddTagCourseParam = {
        tags: [],
    };

    if (detachTags.length) {
        detachTags.forEach((i) => {
            const tagId = {
                tag_id: i,
            };
            deleteTags.tags.push(tagId);
        });
    }

    await WorkspaceService.attachCourseTags(
        workspaceId,
        courseId,
        tags.attachTags
    )
        .then(async (res) => {
            addStatus = res;
            await WorkspaceService.detachCourseManyTags(
                workspaceId,
                courseId,
                deleteTags
            )
                .then((res) => {
                    deleteStatus = res;
                })
                .catch((error) => {
                    deleteStatus = error;
                });
        })
        .catch(async (error) => {
            addStatus = error;
            await WorkspaceService.detachCourseManyTags(
                workspaceId,
                courseId,
                deleteTags
            )
                .then((res) => {
                    deleteStatus = res;
                })
                .catch((error) => {
                    deleteStatus = error;
                });
        });

    handleTagAction(dispatch, addStatus, deleteStatus);

    // if (attachTags.tags.length) {
    //     listRequest.push(
    //         WorkspaceService.attachCourseTags(
    //             workspaceId,
    //             courseId,
    //             tags.attachTags
    //         ).catch(() => {
    //             throw new Error('tags_error');
    //         })
    //     );
    // }
    // if (detachTags.length) {
    //     detachTags.forEach((i) =>
    //         listRequest.push(
    //             WorkspaceService.detachCourseManyTags(
    //                 workspaceId,
    //                 courseId,
    //                 i
    //             ).catch(() => {
    //                 throw new Error('tags_error');
    //             })
    //         )
    //     );
    // }
    // Promise.all(listRequest)
    //     .then(() => {
    //         setTimeout(() => {
    //             dispatch({
    //                 type: WORKSPACE_COURSES.REQ_UPDATE_COURSE_DETAIL_FINISH,
    //             });
    //         }, 1000);
    //     })
    //     .catch((err) => {
    //         setTimeout(() => {
    //             dispatch({
    //                 type: WORKSPACE_COURSES.REQ_UPDATE_COURSE_DETAIL_ERROR,
    //                 value: err.message,
    //             });
    //         }, 1000);
    //     });
    if (Object.keys(params).length) {
        // listRequest.push(
        //     WorkspaceService.updateCourseDetail(workspaceId, courseId, params)
        // );
        WorkspaceService.updateCourseDetail(workspaceId, courseId, params)
            .then(() => {
                setTimeout(() => {
                    dispatch({
                        type: WORKSPACE_COURSES.REQ_UPDATE_COURSE_DETAIL_FINISH,
                    });
                }, 1000);
            })
            .catch((err) => {
                setTimeout(() => {
                    dispatch({
                        type: WORKSPACE_COURSES.REQ_UPDATE_COURSE_DETAIL_ERROR,
                        value: err.message,
                    });
                }, 1000);
            });
    }
};

const updateDetailWorkspace = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    params?: WorkspaceParams
) => {
    dispatch({
        type: WORKSPACE_SETTING.REQ_UPDATE_WORKSPACE,
    });
    WorkspaceService.updateWorkspaceInformation(workspaceId, params)
        .then((res) => {
            if (res) {
                setTimeout(() => {
                    dispatch({
                        type: WORKSPACE_SETTING.REQ_UPDATE_WORKSPACE_FINISH,
                        result: res,
                    });
                }, 500);
            }
        })
        .catch(() => {
            dispatch({
                type: WORKSPACE_SETTING.REQ_UPDATE_WORKSPACE_ERROR,
            });
        });
};

const resetUpdateWorkspaceState = (dispatch: React.Dispatch<any>) =>
    dispatch({
        type: WORKSPACE_SETTING.RESET_UPDATE_WORKSPACE,
    });

const setCurrentRouteDetail = (
    dispatch: React.Dispatch<any>,
    value: { name: string; routeId: string }[]
) => {
    dispatch({
        type: GET_WORKSPACE_DETAIL.REQ_SET_CURRENT_ROUTE_DETAIL,
        currentRouteDetail: value,
    });
};

const getStudentClasses = async (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    classId: string,
    numberPage?: number
) => {
    dispatch({
        type: CLASSES_INVITE.REQ_GET_STUDENT,
    });
    try {
        await WorkspaceService.getClassesMembers(workspaceId, classId, {
            type: 'student',
            page: numberPage ? numberPage : 1,
        }).then((res) => {
            if (res) {
                dispatch({
                    type: CLASSES_INVITE.REQ_GET_STUDENT_FINISH,
                    value: res,
                });
            }
        });
    } catch (err) {
        dispatch({
            type: CLASSES_INVITE.REQ_GET_STUDENT_FAILED,
            err: err.message,
        });
    }
};

const getTeacherClasses = async (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    classId: string,
    numberPage?: number
) => {
    dispatch({
        type: CLASSES_INVITE.REQ_GET_TEACHER,
    });
    try {
        await WorkspaceService.getClassesMembers(workspaceId, classId, {
            type: 'teacher',
            page: numberPage ? numberPage : 1,
        }).then((res) => {
            if (res) {
                dispatch({
                    type: CLASSES_INVITE.REQ_GET_TEACHER_FINISH,
                    value: res,
                });
            }
        });
    } catch (err) {
        dispatch({
            type: CLASSES_INVITE.REQ_GET_TEACHER_FAILED,
            err: err.message,
        });
    }
};

const getMemberForInvite = async (
    dispatch: React.Dispatch<any>,
    email: string,
    workspaceId: string,
    classId: string
) => {
    dispatch({
        type: CLASSES_INVITE.REQ_GET_MEMBER,
    });
    const validateEmail = email.match(FORM_CONST.EMAIL_REGEX);

    try {
        const resWorkspace = await WorkspaceService.getWorkspaceMembers(
            {
                id: workspaceId,
            },
            validateEmail
                ? {
                      email: email,
                  }
                : {
                      q: email,
                  }
        );
        if (resWorkspace.items.length) {
            const resClasses = await WorkspaceService.getClassesMembers(
                workspaceId,
                classId,
                validateEmail
                    ? {
                          email: email,
                      }
                    : {
                          q: email,
                      }
            );
            if (resClasses.items.length) {
                dispatch({
                    type: CLASSES_INVITE.REQ_GET_MEMBER_SUCCESS,
                    class: {
                        userWorkspaceInvite: resWorkspace,
                        userClassesInvite: resClasses,
                    },
                });
            } else {
                dispatch({
                    type: CLASSES_INVITE.REQ_GET_MEMBER_CLASSES_NOT_AVAILABLE,
                    value: resWorkspace,
                });
            }
        }
        if (resWorkspace.items.length === 0) {
            dispatch({
                type: CLASSES_INVITE.REQ_GET_MEMBER_WORKSPACE_NOT_AVAILABLE,
            });
        }
    } catch (err) {
        dispatch({
            type: CLASSES_INVITE.REQ_GET_MEMBER_FAILED,
            err: err.message,
        });
    }
};

const getMemberWorkspaceForInvite = async (
    dispatch: React.Dispatch<any>,
    email: string,
    workspaceId: string
) => {
    dispatch({
        type: CLASSES_INVITE.REQ_GET_MEMBER_WORKSPACE,
    });
    const validateEmail = email.match(FORM_CONST.EMAIL_REGEX);

    await WorkspaceService.getWorkspaceMembers(
        {
            id: workspaceId,
        },
        validateEmail
            ? {
                  email: email,
              }
            : {
                  q: email,
              }
    )
        .then((res) => {
            if (res) {
                dispatch({
                    type: CLASSES_INVITE.REQ_GET_MEMBER_WORKSPACE_SUCCESS,
                    value: res,
                });
            } else {
                dispatch({
                    type: CLASSES_INVITE.REQ_GET_MEMBER_WORKSPACE_NOT_AVAILABLE,
                });
            }
        })
        .catch(() => {
            dispatch({
                type: CLASSES_INVITE.REQ_GET_MEMBER_WORKSPACE_FAILED,
            });
        });
};

const getClassList = (
    dispatch: React.Dispatch<any>,
    params: {
        workspaceId: string;
        classParams: IGetClassParams;
    }
) => {
    dispatch({
        type: CLASS_LIST.REQ_GET_CLASSLIST,
    });
    classService
        .getCLassList(params.workspaceId, params.classParams)
        .then((res) => {
            if (res) {
                dispatch({
                    type: CLASS_LIST.REQ_GET_CLASSLIST_SUCCESS,
                    value: res,
                });
            }
        });
};

const getClassDetail = (
    dispatch: React.Dispatch<any>,
    params: {
        workspaceId: string;
        classId: string;
    }
) => {
    dispatch({
        type: CLASS_LIST.REQ_GET_CLASS_DETAIL,
    });
    classService
        .getClassDetail(params.workspaceId, params.classId)
        .then((res) => {
            if (res) {
                if (!res.description) {
                    res.description = '';
                }
                dispatch({
                    type: CLASS_LIST.REQ_GET_CLASS_DETAIL_SUCCESS,
                    value: res,
                });
            }
        })
        .catch(() => {
            dispatch({
                type: CLASS_LIST.REQ_GET_CLASS_DETAIL_FAIL,
            });
        });
};

const resetClassStatus = (dispatch: React.Dispatch<any>, status?: string) =>
    dispatch({
        type: CLASS_LIST.REQ_RESET_CLASS_DETAIL_STATUS,
        value: status || null,
    });

const updateClass = (
    dispatch: React.Dispatch<any>,
    params: {
        workspaceId: string;
        classId: string;
        updateParams: IPatchClassParams;
    }
) => {
    dispatch({
        type: CLASS_LIST.REQ_UPDATE_CLASS,
    });
    classService
        .updatePartialClass(
            params.workspaceId,
            params.classId,
            params.updateParams
        )
        .then((res) => {
            if (res) {
                if (!res.description) {
                    res.description = '';
                }
                dispatch({
                    type: CLASS_LIST.REQ_UPDATE_CLASS_SUCCESS,
                    value: res,
                });
            }
        })
        .catch((err) => {
            dispatch({
                type: CLASS_LIST.REQ_UPDATE_CLASS_FAIL,
                value: err,
            });
        });
};

const getClassSessions = (
    dispatch: React.Dispatch<any>,
    params: {
        workspaceId: string;
        classId: string;
        params?: IClassSessionParams;
    }
) => {
    dispatch({
        type: CLASS_LIST.REQ_GET_CLASS_SESSION,
    });
    classService
        .getClassSession(params.workspaceId, params.classId, params.params)
        .then((res) => {
            if (res) {
                dispatch({
                    type: CLASS_LIST.REQ_GET_CLASS_SESSION_SUCCESS,
                    value: res,
                });
            }
        })
        .catch(() => {
            dispatch({
                type: CLASS_LIST.REQ_GET_CLASS_SESSION_FAIL,
            });
        });
};

const inviteUserClasses = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    classId: string,
    body: MemberInviteType,
    isMeAsTeacher: boolean,
    successCallback?: Function
) => {
    dispatch({
        type: CLASSES_INVITE.REQ_INVITE_EMAIL,
    });
    classService
        .inviteEmail(workspaceId, classId, body)
        .then((res) => {
            if (res) {
                dispatch({
                    type: CLASSES_INVITE.REQ_INVITE_EMAIL_FINISH,
                    value: body.typeInvite,
                });
                if (isMeAsTeacher) {
                    dispatch({
                        type: CLASSES_INVITE.REQ_INVITE_TEACHER_AS_ME,
                    });
                }
                successCallback();
            }
        })
        .catch((err) => {
            if (
                err?.error?.code === 400 &&
                err?.error?.name === 'VALIDATION_ERROR'
            ) {
                if (err?.error?.body_params[0].msg === 'INVALID_MEMBER_TYPE') {
                    dispatch({
                        type: CLASSES_INVITE.REQ_INVITE_EMAIL_FAILED_INVALID,
                    });
                }
            } else {
                dispatch({
                    type: CLASSES_INVITE.REQ_INVITE_EMAIL_FAILED,
                });
            }
            successCallback();
        });
};

const resetStatusClasses = (dispatch: React.Dispatch<any>) => {
    dispatch({
        type: CLASSES_INVITE.REQ_RESET_STATUS_CLASSES,
    });
};

const resetInviteClasses = (dispatch: React.Dispatch<any>) => {
    dispatch({
        type: CLASSES_INVITE.REQ_RESET_INVITE_CLASSES,
    });
};

const removeUserClasses = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    classId: string,
    userId: number,
    typeOption: 'student' | 'teacher'
) => {
    dispatch({
        type: CLASSES_INVITE.REQ_REMOVE_MEMBER,
        value: {
            userId: userId,
            typeOption: typeOption,
        },
    });
    classService
        .removeMemberClasses(workspaceId, classId, userId)
        .then((res) => {
            if (res) {
                dispatch({
                    type: CLASSES_INVITE.REQ_REMOVE_MEMBER_SUCCESS,
                });
            }
        })
        .catch(() => {
            dispatch({
                type: CLASSES_INVITE.REQ_REMOVE_MEMBER_FAILED,
            });
        });
};

export default {
    createWorkspace,
    getListOfWorkspace,
    inviteMembers,
    getWorkspace,
    resetUserState,
    getWorkspaceMembers,
    setWorkspaceId,
    removeWorkspaceId,
    setUserRole,
    setUserWorkspaceCreator,
    setWorkspaceDriveId,
    setCurrentUploadNavigation,
    getLessonList,
    setCurrentLesson,
    getLessonTags,
    getLessonDetail,
    updateLessonDetail,
    getPendingAdminList,
    adminApprove,
    adminDecline,
    getCoursesList,
    getCourseDetail,
    getAdminList,
    updateDetailCourse,
    updateDetailWorkspace,
    resetUpdateWorkspaceState,
    setCurrentRouteDetail,
    resetWorkspaceDetailError,
    getMemberForInvite,
    getClassList,
    getClassDetail,
    updateClass,
    getClassSessions,
    getStudentClasses,
    getTeacherClasses,
    inviteUserClasses,
    resetStatusClasses,
    getMemberWorkspaceForInvite,
    removeUserClasses,
    resetClassStatus,
    resetInviteClasses,
};
