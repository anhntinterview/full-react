import {
    SET_H5P_PLAYER,
    SET_H5P_CONTENT_LIST,
    SET_H5P_STATUS,
    H5P_CONTENT,
} from 'actions/h5p.action';
import { IH5PState, IH5PAction } from 'types/H5P.type';

export default function h5pReducer(state: IH5PState, action: IH5PAction) {
    switch (action.type) {
        // H5P PLAYER
        case SET_H5P_PLAYER.REQ_H5P_PLAYER:
            return {
                ...state,
                isLoading: true,
                status: 'pending',
            };
        case SET_H5P_PLAYER.REQ_H5P_PLAYER_SUCCESS:
            console.log(action);

            return {
                ...state,
                isLoading: false,
                h5PPlayerResult: action.h5PPlayerResult,
                status: 'done',
            };
        case SET_H5P_PLAYER.REQ_H5P_PLAYER_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
                status: 'fail',
            };
        // H5P CONTENT LIST
        case SET_H5P_CONTENT_LIST.REQ_H5P_CONTENT_LIST:
            return {
                ...state,
                isLoading: true,
                status: 'pending',
            };
        case SET_H5P_CONTENT_LIST.REQ_H5P_CONTENT_LIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                h5PContentListResult: action.h5PContentListResult,
                status: 'done',
            };
        case SET_H5P_CONTENT_LIST.REQ_H5P_CONTENT_LIST_FAIL:
            console.log('action', action);
            return {
                ...state,
                isLoading: false,
                err: action.err,
                status: 'fail',
            };
        // H5P APPROVE CONTENT
        case SET_H5P_STATUS.REQ_H5P_STATUS:
            return {
                ...state,
                isLoading: true,
                h5PApproveContentResult: undefined,
                status: 'pending',
            };
        case SET_H5P_STATUS.REQ_H5P_STATUS_SUCCESS:
            console.log(action);
            return {
                ...state,
                isLoading: false,
                h5PApproveContentResult: action.h5PApproveContentResult,
                status: 'done',
            };
        case SET_H5P_STATUS.REQ_H5P_STATUS_FAIL:
            return {
                ...state,
                isLoading: false,
                err: action.err,
                status: 'fail',
            };
        case SET_H5P_STATUS.REQ_H5P_RESET_STATUS:
            return {
                ...state,
                h5PApproveContentResult: undefined,
            };
        case H5P_CONTENT.REQ_SET_CURRENT_H5P:
            return {
                ...state,
                currentH5P: action.currentH5P,
            };
        case SET_H5P_CONTENT_LIST.REQ_H5P_SORT_LIST:
            return {
                ...state,
                params: action.params,
            };
        default:
            return state;
    }
}
