// ACTION
import React from 'react';
import { SET_GOOGLE } from 'actions/google.action';
// SERVICE
import { GoogleService } from 'services';
import { initGoogleState } from 'state/Google/google.state';
// TYPE
import {
    FormDataType,
    GoogleDriveArgsType,
    GoogleTypeFolder,
    MultipleFolderType,
    ParentFile,
    TreeFolder,
    UpdateFilesArgs,
} from 'types/GoogleType';

const getListGoogleDrive = (
    dispatch: React.Dispatch<any>,
    args: GoogleDriveArgsType
) => {
    dispatch({ type: SET_GOOGLE.REQ_GOOGLE_API_AND_SERVICES });
    try {
        // fetch list
        GoogleService.getListGoogleDrive(args).then((result) => {
            dispatch({
                type: SET_GOOGLE.REQ_GOOGLE_DRIVE_GET_LIST_SUCCESS,
                driveGoogleGetListResult:
                    result || initGoogleState.driveGoogleGetListResult,
            });
        });
    } catch (err) {
        dispatch({
            type: SET_GOOGLE.REQ_GOOGLE_DRIVE_GET_LIST_FAIL,
            err: err.toJSON().message,
        });
    }
};

const resetUpdateFileToast = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: SET_GOOGLE.REQ_GOOGLE_DRIVE_UPDATE_FILE_RESET });
};

const updateFile = (dispatch: React.Dispatch<any>, args: UpdateFilesArgs) => {
    const {
        files: { target, destination, targetId },
        action,
    } = args;
    dispatch({ type: SET_GOOGLE.REQ_GOOGLE_DRIVE_UPDATE_FILE_RESET });
    dispatch({
        type: SET_GOOGLE.REQ_GOOGLE_DRIVE_UPDATE_FILE,
        target,
        destination,
        targetId,
        action,
        deletingId: targetId,
    });
    try {
        GoogleService.updateGoogleFile(args)
            .then((result) => {
                if (result && result.id) {
                    dispatch({
                        type: SET_GOOGLE.REQ_GOOGLE_DRIVE_UPDATE_FILE_SUCCESS,
                    });
                } else throw result;
            })
            .catch((err) => {
                console.log('error', err);
                dispatch({
                    type: SET_GOOGLE.REQ_GOOGLE_DRIVE_UPDATE_FILE_FAIL,
                    errors: err,
                });
            });
    } catch (error) {
        dispatch({ type: SET_GOOGLE.REQ_GOOGLE_DRIVE_UPDATE_FILE_FAIL });
    }
};

const changeReducerUploadFile = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: SET_GOOGLE.REQ_GOOGLE_API_FILE });
};

const uploadNewFolderGoogleDrive = async (
    dispatch: React.Dispatch<any>,
    body: GoogleTypeFolder
) => {
    dispatch({ type: SET_GOOGLE.REQ_GOOGLE_API_AND_SERVICES });
    let resultFolder;
    try {
        await GoogleService.updateNewFolderGoogleDrive(body)
            .then((result) => {
                dispatch({
                    type: SET_GOOGLE.REQ_GOOGLE_UPLOAD_NEW_FOLDER_SUCCESS,
                    driveGoogleFolderResult: result,
                });
                return (resultFolder = result);
            })
            .catch((error) => {
                console.error('Error:', error);
                dispatch({
                    type: SET_GOOGLE.REQ_GOOGLE_UPLOAD_NEW_FOLDER_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_GOOGLE.REQ_GOOGLE_UPLOAD_NEW_FOLDER_FAIL,
            err: err.toJSON().message,
        });
    }
    return resultFolder;
};

const uploadFileGoogleDrive = (
    dispatch: React.Dispatch<any>,
    body: FormDataType[]
) => {
    dispatch({ type: SET_GOOGLE.REQ_GOOGLE_API_AND_SERVICES });

    const item = body.map((d) => {
        const form = new FormData();
        form.set(
            'metadata',
            new Blob([JSON.stringify(d.metadata)], {
                type: 'application/json',
            })
        );
        form.set('file', d.file);
        return GoogleService.uploadFileGoogleDrive(form);
    });
    try {
        Promise.all(item)
            .then((result) => {
                dispatch({
                    type: SET_GOOGLE.REQ_GOOGLE_UPLOAD_FILE_SUCCESS,
                    driveGoogleUploadFileResult: result,
                });
            })
            .catch((error) => {
                console.error('Error:', error);
                dispatch({
                    type: SET_GOOGLE.REQ_GOOGLE_UPLOAD_FILE_FAIL,
                    err: error,
                });
            });
    } catch (err) {
        dispatch({
            type: SET_GOOGLE.REQ_GOOGLE_UPLOAD_FILE_FAIL,
            err: err.toJSON().message,
        });
    }
};

const getDataLocal = (
    dispatch: React.Dispatch<any>,
    localData: MultipleFolderType
) => {
    dispatch({ type: SET_GOOGLE.REQ_GOOGLE_GET_LOCAL_FILE, localData });
};
const removeDataLocal = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: SET_GOOGLE.REQ_GOOGLE_GET_LOCAL_FILE });
};
const getFile = (dispatch: React.Dispatch<any>, fileId: string) => {
    dispatch({ type: SET_GOOGLE.REQ_GOOGLE_GET_FILE });
    GoogleService.getGoogleDriveFile(fileId)
        .then((res) => {
            dispatch({
                type: SET_GOOGLE.REQ_GOOGLE_GET_FILE_SUCCESS,
                fileDetail: res,
            });
        })
        .catch((err) => {
            dispatch({
                type: SET_GOOGLE.REQ_GOOGLE_GET_FILE_FAIL,
                errors: err,
            });
        });
};

const setRightMenuContext = (dispatch: React.Dispatch<any>, action: string) => {
    dispatch({
        type: SET_GOOGLE.REQ_GOOGLE_CONTEXT_ACTION_SET,
        contextAction: action,
    });
};

const setTreeFolder = (
    dispatch: React.Dispatch<any>,
    treeFolder: TreeFolder
) => {
    dispatch({ type: SET_GOOGLE.REQ_GOOGLE_SET_TREE_FOLDER, treeFolder });
};

const removeTreeFolder = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: SET_GOOGLE.REQ_GOOGLE_REMOVE_TREE_FOLDER });
};

const actionUpload = (
    dispatch: React.Dispatch<any>,
    driveUploadAction: string
) => {
    dispatch({ type: SET_GOOGLE.REQ_GOOGLE_ACTION_UPLOAD, driveUploadAction });
};

const setParentDrop = (
    dispatch: React.Dispatch<any>,
    parentDrop: ParentFile
) => {
    dispatch({ type: SET_GOOGLE.REQ_GOOGLE_PARENT_DROP, parentDrop });
};

export default {
    getListGoogleDrive,
    updateFile,
    resetUpdateFileToast,
    uploadNewFolderGoogleDrive,
    uploadFileGoogleDrive,
    changeReducerUploadFile,
    getFile,
    setRightMenuContext,
    getDataLocal,
    removeDataLocal,
    setTreeFolder,
    removeTreeFolder,
    actionUpload,
    setParentDrop,
};
