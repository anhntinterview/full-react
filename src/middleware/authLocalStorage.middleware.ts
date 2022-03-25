import * as React from 'react';
// ACTIONS
import { SET_AUTH_LOCAL_STORAGE } from 'actions/auth.action';

const getLocalStorage = (dispatch: React.Dispatch<any>) => {
    dispatch({
        type: SET_AUTH_LOCAL_STORAGE.REQ_GET_AUTH_LOCAL_STORAGE,
    });
};

const removeLocalStorage = (dispatch: React.Dispatch<any>) => {
    dispatch({
        type: SET_AUTH_LOCAL_STORAGE.REQ_REMOVE_AUTH_LOCAL_STORAGE,
    });
};

export default {
    getLocalStorage,
    removeLocalStorage,
};
