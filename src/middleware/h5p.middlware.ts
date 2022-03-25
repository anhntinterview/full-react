import {
    SET_H5P_PLAYER,
    SET_H5P_EDITOR,
    SET_H5P_CONTENT_LIST,
    SET_H5P_STATUS,
    SET_H5P_UPDATE,
    H5P_CONTENT,
} from 'actions/h5p.action';
import { IH5PPlayerArgs, ParamsH5P, TagsType } from 'types/H5P.type';
import H5PServices from 'services/h5p.service';
import h5pService from 'services/h5p.service';
import { ListParam } from 'types/ApiData.type';

const h5pContentList = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    params?: ListParam
) => {
    dispatch({ type: SET_H5P_CONTENT_LIST.REQ_H5P_CONTENT_LIST });
    // try {
    H5PServices.h5pContentList(workspaceId, params)
        .then((result) => {
            console.log(result);
            dispatch({
                type: SET_H5P_CONTENT_LIST.REQ_H5P_CONTENT_LIST_SUCCESS,
                h5PContentListResult: result,
            });
            // dispatch({
            //     type: SET_H5P_CONTENT_LIST.REQ_H5P_CONTENT_LIST_FAIL,
            //     err: `${result.status} ${result.statusText}`,
            // });
        })
        .catch((error) => {
            dispatch({
                type: SET_H5P_CONTENT_LIST.REQ_H5P_CONTENT_LIST_FAIL,
                err: error,
            });
        });
    // } catch (err) {
    //     dispatch({
    //         type: SET_H5P_PLAYER.REQ_H5P_PLAYER_FAIL,
    //         err: err.toJson().message,
    //     });
    // }
};

const h5pEditor = (dispatch: React.Dispatch<any>, args: IH5PPlayerArgs) => {
    dispatch({ type: SET_H5P_EDITOR.REQ_H5P_EDITOR });
    try {
        H5PServices.h5pEditor(args)
            .then((result) => {
                if (result) {
                    if (result.status === 204) {
                        dispatch({
                            type: SET_H5P_EDITOR.REQ_H5P_EDITOR_SUCCESS,
                            result: result.status,
                        });
                    } else {
                        const rs = result.json();
                        rs.then((r) => {
                            if (result.status === 200) {
                                dispatch({
                                    type: SET_H5P_EDITOR.REQ_H5P_EDITOR_SUCCESS,
                                    h5PEditorResult: r,
                                });
                            }

                            if (!result || !result.ok) {
                                dispatch({
                                    type: SET_H5P_EDITOR.REQ_H5P_EDITOR_FAIL,
                                    err: `${result.status} ${result.statusText}`,
                                });
                            }
                        });
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                dispatch({
                    type: SET_H5P_EDITOR.REQ_H5P_EDITOR_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_H5P_PLAYER.REQ_H5P_PLAYER_FAIL,
            err: err.toJson().message,
        });
    }
};

const h5pPlayer = (dispatch: React.Dispatch<any>, args: IH5PPlayerArgs) => {
    dispatch({ type: SET_H5P_PLAYER.REQ_H5P_PLAYER });
    try {
        H5PServices.h5pPlayer(args)
            .then((result) => {
                if (result) {
                    if (result.status === 204) {
                        dispatch({
                            type: SET_H5P_PLAYER.REQ_H5P_PLAYER_SUCCESS,
                            result: result.status,
                        });
                    } else {
                        const rs = result.json();
                        rs.then((r) => {
                            if (result.status === 200) {
                                dispatch({
                                    type: SET_H5P_PLAYER.REQ_H5P_PLAYER_SUCCESS,
                                    h5PPlayerResult: r,
                                });
                            }

                            if (!result || !result.ok) {
                                dispatch({
                                    type: SET_H5P_PLAYER.REQ_H5P_PLAYER_FAIL,
                                    err: `${result.status} ${result.statusText}`,
                                });
                            }
                        });
                    }
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                dispatch({
                    type: SET_H5P_PLAYER.REQ_H5P_PLAYER_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_H5P_PLAYER.REQ_H5P_PLAYER_FAIL,
            err: err.toJson().message,
        });
    }
};

const h5pResetStatus = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: SET_H5P_STATUS.REQ_H5P_RESET_STATUS });
};

const h5pAddTag = (
    dispatch: React.Dispatch<any>,
    args: IH5PPlayerArgs,
    tags: TagsType
) => {
    try {
        H5PServices.h5pAddTag(args, tags)
            .then((result) => {
                if (result) {
                    if (result.status === 204) {
                        dispatch({
                            type: SET_H5P_UPDATE.REQ_H5P_ADD_TAG_SUCCESS,
                        });
                    } else {
                    }
                }
            })
            .catch((error) => {
                dispatch({
                    type: SET_H5P_UPDATE.REQ_H5P_ADD_TAG_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_H5P_UPDATE.REQ_H5P_ADD_TAG_FAIL,
        });
    }
};

const getCurentH5P = (dispatch: React.Dispatch<any>, args: IH5PPlayerArgs) => {
    h5pService
        .h5pEditPromise(args)
        .then((res) => {
            dispatch({
                type: H5P_CONTENT.REQ_SET_CURRENT_H5P,
                currentH5P: res,
            });
        })
        .catch(() => {
            dispatch({
                type: H5P_CONTENT.REQ_SET_CURRENT_H5P,
                currentH5P: undefined,
            });
        });
};

const h5pParamsContent = (dispatch: React.Dispatch<any>, params: ParamsH5P) => {
    dispatch({ type: SET_H5P_CONTENT_LIST.REQ_H5P_SORT_LIST, params: params });
};

const recoverH5P = (
    dispatch: React.Dispatch<any>,
    workspaceId: string,
    contentId: number
) => {
    h5pService
        .recoverH5P(workspaceId, contentId)
        .then((res) => {
            dispatch({
                type: H5P_CONTENT.REQ_H5P_RECOVER,
            });
        })
        .catch(() => {
            dispatch({
                type: H5P_CONTENT.REQ_H5P_RECOVER,
            });
        });
};

export default {
    h5pContentList,
    h5pEditor,
    h5pPlayer,
    h5pResetStatus,
    h5pAddTag,
    getCurentH5P,
    h5pParamsContent,
    recoverH5P,
};
