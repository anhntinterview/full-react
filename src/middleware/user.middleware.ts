// ACTION
import { SET_PASSWORD } from 'actions/password.action';
import { SET_USER } from 'actions/user.action';
// SERVICE
import { UserService, WorkspaceService } from 'services';
// TYPE
import { CreatePasswordArgsType } from 'types/CreatePassword.type';
import { UpdatePasswordArgsType } from 'types/UpdatePassword.type';
import {
    UpdateUserArgsType,
    UploadResourceArgsType,
    UploadAvatarFinalArgsType,
} from 'types/User.type';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';

const refreshUploadAvatarProcess = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: SET_USER.REQ_REFRESH_UPLOAD_AVATAR_PROCESS });
};

const uploadAvatarFinal = (
    dispatch: React.Dispatch<any>,
    args: UploadAvatarFinalArgsType
) => {
    dispatch({ type: SET_USER.REQ_UPLOAD_AVATAR });
    try {
        UserService.uploadAvatarFinal(args)
            .then((result) => {
                if (result.error || result.validation_error) {
                    dispatch({
                        type: SET_USER.REQ_UPLOAD_AVATAR_FINAL_FAIL,
                        err: result,
                    });
                }
                dispatch({
                    type: SET_USER.REQ_UPLOAD_AVATAR_FINAL_SUCCESS,
                    result,
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                dispatch({
                    type: SET_USER.REQ_UPLOAD_AVATAR_FINAL_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_USER.REQ_UPLOAD_AVATAR_FINAL_FAIL,
            err: err.toJSON().message,
        });
    }
};

const uploadAvatarFormData = (
    dispatch: React.Dispatch<any>,
    avatar: File,
    canvas: HTMLCanvasElement | undefined
) => {
    dispatch({ type: SET_USER.REQ_UPLOAD_AVATAR });
    try {
        UserService.uploadImage(
            avatar,
            (path) => {
                dispatch({
                    type: SET_USER.REQ_UPLOAD_AVATAR_FORM_DATA_SUCCESS,
                    path,
                });
            },
            (error) => {
                console.error('Error:', error);
                dispatch({
                    type: SET_USER.REQ_UPLOAD_AVATAR_FORM_DATA_FAIL,
                    err: error,
                });
            },
            canvas
        );
    } catch (err) {
        dispatch({
            type: SET_USER.REQ_UPLOAD_AVATAR_FORM_DATA_FAIL,
            err: err.toJSON().message,
        });
    }
};

const getUser = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: SET_USER.REQ_USER });
    try {
        UserService.getUser()
            .then((result) => {
                if (result) {
                    dispatch({
                        type: SET_USER.REQ_USER_SUCCESS,
                        result,
                    });
                    // rs.then((r) => {
                    //     if (result.status === 204) {
                    //         dispatch({
                    //             type: SET_USER.REQ_USER_SUCCESS,
                    //             result: r || result.status,
                    //         });
                    //     }
                    //     if (r.error) {
                    //         dispatch({
                    //             type: SET_USER.REQ_USER_FAIL,
                    //             err: r,
                    //         });
                    //     }
                    //     if (r.validation_error) {
                    //         dispatch({
                    //             type: SET_USER.REQ_USER_FAIL,
                    //             valErr: r,
                    //         });
                    //     }
                    // });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                dispatch({
                    type: SET_USER.REQ_USER_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_USER.REQ_USER_FAIL,
            err: err.message,
        });
    }
};

const updateUser = async (
    dispatch: React.Dispatch<any>,
    args: UpdateUserArgsType
) => {
    dispatch({ type: SET_USER.REQ_UPDATE_USER });
    try {
        if (args.avatar) {
            let _path: string | undefined;
            await UserService.uploadImage(
                args.avatar,
                (path) => (_path = path),
                (error) => {}
            );
            if (_path) {
                await UserService.uploadAvatarFinal({
                    avatar: _path,
                });
            }
        }
        UserService.updateUser(args)
            .then((result) => {
                if (result.error) {
                    dispatch({
                        type: SET_USER.REQ_UPDATE_USER_FAIL,
                        err: result,
                    });
                }
                dispatch({
                    type: SET_USER.REQ_UPDATE_USER_SUCCESS,
                    result,
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                dispatch({
                    type: SET_USER.REQ_UPDATE_USER_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_USER.REQ_UPDATE_USER_FAIL,
            err: err.toJSON().message,
        });
    }
};
const patchUpdateUser = async (
    dispatch: React.Dispatch<any>,
    args: Partial<UpdateUserArgsType>
) => {
    dispatch({ type: SET_USER.REQ_UPDATE_USER });
    try {
        if (args.avatar) {
            let _path: string | undefined;
            await UserService.uploadImage(
                args.avatar,
                (path) => (_path = path),
                (error) => {}
            );
            if (_path) {
                await UserService.uploadAvatarFinal({
                    avatar: _path,
                });
            }
        }
        UserService.patchUpdateUser(args)
            .then((result) => {
                if (result.error) {
                    dispatch({
                        type: SET_USER.REQ_UPDATE_USER_FAIL,
                        err: result,
                    });
                }
                dispatch({
                    type: SET_USER.REQ_UPDATE_USER_SUCCESS,
                    result,
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                dispatch({
                    type: SET_USER.REQ_UPDATE_USER_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_USER.REQ_UPDATE_USER_FAIL,
            err: err.toJSON().message,
        });
    }
};

const updatePassword = (
    dispatch: React.Dispatch<any>,
    args: UpdatePasswordArgsType
) => {
    dispatch({ type: SET_PASSWORD.REQ_SET_PASSWORD });
    try {
        UserService.updatePassword(args)
            .then((result) => {
                // if (result.error) {
                //     dispatch({
                //         type: SET_PASSWORD.REQ_UPDATE_PASSWORD_FAIL,
                //         err: result,
                //     });
                // }
                // if (result.validation_error) {
                //     dispatch({
                //         type: SET_PASSWORD.REQ_UPDATE_PASSWORD_FAIL,
                //         valErr: result,
                //     });
                // }
                dispatch({
                    type: SET_PASSWORD.REQ_UPDATE_PASSWORD_SUCCESS,
                    result,
                });
            })
            .catch((error) => {
                dispatch({
                    type: SET_PASSWORD.REQ_UPDATE_PASSWORD_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_PASSWORD.REQ_UPDATE_PASSWORD_FAIL,
            err: err.toJSON().message,
        });
    }
};

const getRole = async (dispatch: React.Dispatch<any>, workspaceId: string) => {
    const userInfo = getLocalStorageAuthData();
    try {
        const res = await WorkspaceService.getWorkspaceMembers(
            {
                id: workspaceId,
            },
            {
                email: userInfo.email,
            }
        );
        const result = await res?.json();
        if (result && result.items) {
            dispatch({
                type: SET_USER.REQ_USER_ROLE,
                role: result.items[0].membership.role,
            });
            dispatch({
                type: SET_USER.REQ_SET_CREATOR,
                isCreator: result.items[0].membership.is_creator,
            });
        } else if (!result.items) {
            dispatch({
                type: SET_USER.REQ_USER_ROLE,
                role: '',
            });
            dispatch({
                type: SET_USER.REQ_SET_CREATOR,
                isCreator: false,
            });
        }
    } catch (err) {
        console.log(err);
    }
};

const resetUserState = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: SET_USER.RESET_USER_INFORMATION });
};

export default {
    uploadAvatarFinal,
    uploadAvatarFormData,
    getUser,
    updateUser,
    updatePassword,
    getRole,
    refreshUploadAvatarProcess,
    resetUserState,
    patchUpdateUser,
};
