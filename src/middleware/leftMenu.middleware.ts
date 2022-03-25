// ACTION
import React from 'react';
import { SET_MENU_LEFT } from 'actions/leftmenu.action';

const setFile = (dispatch: React.Dispatch<any>, data: FileList | null) => {
    dispatch({ type: SET_MENU_LEFT.REQ_GET_FILE_UPLOAD, data });
};

const removeFile = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: SET_MENU_LEFT.REQ_REMOVE_FILE_UPLOAD });
};

const setFolderName = (dispatch: React.Dispatch<any>, folderName: string) => {
    dispatch({
        type: SET_MENU_LEFT.REQ_GET_FOLDER_NAME_UPLOAD,
        folderName,
    });
};

const removeFolderName = (dispatch: React.Dispatch<any>) => {
    dispatch({ type: SET_MENU_LEFT.REQ_REMOVE_FOLDER_NAME_UPLOAD });
};

export default {
    setFile,
    removeFile,
    setFolderName,
    removeFolderName,
};
