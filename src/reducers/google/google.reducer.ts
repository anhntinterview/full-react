import { result } from 'lodash';
import {
    SET_GOOGLE,
    SET_GOOGLE_SERVER_SIDE,
} from 'actions/google.action';
import {
    GoogleState,
    GoogleAction,
    GoogleServerSideState,
    GoogleServerSideAction,
} from 'types/GoogleType';

export function googleServerSideReducer(
    state: GoogleServerSideState,
    action: GoogleServerSideAction
) {
    switch (action.type) {
        case SET_GOOGLE_SERVER_SIDE.REQ_GOOGLE_SERVER_SIDE_API_AND_SERVICES:
            return {
                ...state,
                isLoading: true,
                status: 'pending',
            };
        // OAUTH2
        // STEP 1: Get Drive authenticate URL
        case SET_GOOGLE_SERVER_SIDE.REQ_GET_DRIVE_AUTHENTICATE_URL_OAUTH2_SUCCESS:
            return {
                ...state,
                isLoading: false,

                getDriveAuthentiacteUrlResult:
                    action.getDriveAuthentiacteUrlResult,

                getDriveAuthentiacteUrlResponseError: undefined,
                getDriveAuthentiacteUrlResponseValidateError: undefined,

                authentiacteWithDriveResponseError: undefined,
                authentiacteWithDriveResponseValidateError: undefined,

                getDriveCredentialOfWorkspaceResponseError: undefined,
                getDriveCredentialOfWorkspaceResponseValidateError: undefined,

                status: 'done',
            };
        case SET_GOOGLE_SERVER_SIDE.REQ_GET_DRIVE_AUTHENTICATE_URL_OAUTH2_FAIL:
            return {
                ...state,
                isLoading: false,
                getDriveAuthentiacteUrlResponseError:
                    action.getDriveAuthentiacteUrlResponseError,
                getDriveAuthentiacteUrlResponseValidateError:
                    action.getDriveAuthentiacteUrlResponseValidateError,
                status: 'fail',
            };
        // STEP 2: Authentication with Drive
        case SET_GOOGLE_SERVER_SIDE.REQ_AUTHENTICATE_WITH_DRIVE_OAUTH2_SUCCESS:
            return {
                ...state,
                isLoading: false,

                authentiacteWithDriveResult: action.authentiacteWithDriveResult,

                getDriveAuthentiacteUrlResponseError: undefined,
                getDriveAuthentiacteUrlResponseValidateError: undefined,

                authentiacteWithDriveResponseError: undefined,
                authentiacteWithDriveResponseValidateError: undefined,

                getDriveCredentialOfWorkspaceResponseError: undefined,
                getDriveCredentialOfWorkspaceResponseValidateError: undefined,

                status: 'done',
            };
        case SET_GOOGLE_SERVER_SIDE.REQ_AUTHENTICATE_WITH_DRIVE_OAUTH2_FAIL:
            return {
                ...state,
                isLoading: false,
                authentiacteWithDriveResponseError:
                    action.authentiacteWithDriveResponseError,
                authentiacteWithDriveResponseValidateError:
                    action.authentiacteWithDriveResponseValidateError,
                status: 'fail',
            };
        // STEP 3: Get Drive credentials of workspace
        case SET_GOOGLE_SERVER_SIDE.REQ_GET_DRIVE_CREDENTIALS_OF_WORKSPACE_OAUTH2_SUCCESS:
            return {
                ...state,
                isLoading: false,

                getDriveCredentialOfWorkspaceResult:
                    action.getDriveCredentialOfWorkspaceResult,

                getDriveAuthentiacteUrlResponseError: undefined,
                getDriveAuthentiacteUrlResponseValidateError: undefined,

                authentiacteWithDriveResponseError: undefined,
                authentiacteWithDriveResponseValidateError: undefined,

                getDriveCredentialOfWorkspaceResponseError: undefined,
                getDriveCredentialOfWorkspaceResponseValidateError: undefined,

                status: 'done',
            };
        case SET_GOOGLE_SERVER_SIDE.REQ_GET_DRIVE_CREDENTIALS_OF_WORKSPACE_OAUTH2_FAIL:
            return {
                ...state,
                isLoading: false,
                getDriveCredentialOfWorkspaceResponseError:
                    action.getDriveCredentialOfWorkspaceResponseError,
                getDriveCredentialOfWorkspaceResponseValidateError:
                    action.getDriveCredentialOfWorkspaceResponseValidateError,
                status: 'fail',
            };
        default:
            return state;
    }
}

export function googleReducer(state: GoogleState, action: GoogleAction) {
    switch (action.type) {
        case SET_GOOGLE.REQ_GOOGLE_API_AND_SERVICES:
            return {
                ...state,
                isLoading: true,
                isLoadingUpload: false,
                params: action.params,
                status: 'pending',
                isLoadingList: true,
            };
        case SET_GOOGLE.REQ_GOOGLE_DRIVE_GET_LIST_SUCCESS:
            return {
                ...state,
                isLoading: false,
                isLoadingList: false,
                googleOAuth2Err: undefined,
                driveGoogleErr: undefined,
                driveGoogleGetListResult: action.driveGoogleGetListResult,
                status: 'done',
            };
        case SET_GOOGLE.REQ_GOOGLE_DRIVE_GET_LIST_FAIL:
            return {
                ...state,
                isLoading: false,
                driveGoogleGetListErr: action.driveGoogleGetListErr,
                status: 'fail',
            };
        case SET_GOOGLE.REQ_GOOGLE_DRIVE_UPDATE_FILE_RESET:
            return {
                ...state,
                target: '',
                destination: '',
                action: '',
                updateStatus: '',
                errors: undefined,
            };
        case SET_GOOGLE.REQ_GOOGLE_DRIVE_UPDATE_FILE:
            return {
                ...state,
                updateStatus: '',
                target: action.target,
                targetId: action.targetId,
                destination: action.destination,
                action: action.action,
                deletingId: action.deletingId,
            };
        case SET_GOOGLE.REQ_GOOGLE_DRIVE_UPDATE_FILE_SUCCESS:
            return {
                ...state,
                updateStatus: 'done',
            };
        case SET_GOOGLE.REQ_GOOGLE_DRIVE_UPDATE_FILE_FAIL:
            return {
                ...state,
                updateStatus: 'fail',
                errors: action.errors,
            };

        case SET_GOOGLE.REQ_GOOGLE_UPLOAD_NEW_FOLDER_SUCCESS:
            return {
                ...state,
                isLoaded: false,
                isLoadingList: false,
                googleOAuth2Err: undefined,
                driveGoogleErr: undefined,
                driveGoogleFolderResult: action.driveGoogleFolderResult,
                driveGoogleFolderErr: undefined,
                status: 'done',
            };
        case SET_GOOGLE.REQ_GOOGLE_UPLOAD_NEW_FOLDER_FAIL:
            return {
                ...state,
                isLoaded: false,
                isLoadingList: false,
                driveGoogleFolderErr: action.driveGoogleFolderErr,
                status: 'fail',
            };
        case SET_GOOGLE.REQ_GOOGLE_UPLOAD_FILE_SUCCESS:
            return {
                ...state,
                isLoaded: false,
                isLoadingUpload: true,
                isLoadingList: false,
                googleOAuth2Err: undefined,
                driveGoogleErr: undefined,
                driveGoogleFolderResult: undefined,
                driveGoogleUploadFileResult: action.driveGoogleUploadFileResult,
                driveGoogleFolderErr: undefined,
                uploadStatus: 'done',
            };
        case SET_GOOGLE.REQ_GOOGLE_UPLOAD_FILE_FAIL:
            return {
                ...state,
                isLoaded: false,
                isLoadingList: false,
                isLoadingUpload: true,
                driveGoogleFolderErr: action.driveGoogleFolderErr,
                uploadStatus: 'fail',
            };
        case SET_GOOGLE.REQ_GOOGLE_API_FILE:
            return {
                ...state,
                isLoadingUpload: false,
                uploadStatus: '',
            };
        case SET_GOOGLE.REQ_GOOGLE_GET_LOCAL_FILE:
            return {
                ...state,
                localData: action.localData,
            };
        case SET_GOOGLE.REQ_GOOGLE_REMOVE_LOCAL_FILE:
            return {
                ...state,
                localData: undefined,
            };
        case SET_GOOGLE.REQ_GOOGLE_GET_FILE:
            return {
                ...state,
                isLoadingFile: true,
                fileDetail: undefined,
            };
        case SET_GOOGLE.REQ_GOOGLE_GET_FILE_SUCCESS:
            return {
                ...state,
                isLoadingFile: false,
                fileDetail: action.fileDetail,
                fileStatus: 'done',
            };
        case SET_GOOGLE.REQ_GOOGLE_GET_FILE_FAIL:
            return {
                ...state,
                isLoadingFile: false,
                fileStatus: 'fail',
                errors: action.errors,
            };
        case SET_GOOGLE.REQ_GOOGLE_CONTEXT_ACTION_SET:
            return {
                ...state,
                contextAction: action.contextAction,
            };

        case SET_GOOGLE.REQ_GOOGLE_SET_TREE_FOLDER:
            return {
                ...state,
                isLoadingStart: true,
                treeFolder: action.treeFolder,
            };
        case SET_GOOGLE.REQ_GOOGLE_REMOVE_TREE_FOLDER:
            return {
                ...state,
                isLoadingStart: false,
                treefolder: undefined,
            };

        case SET_GOOGLE.REQ_GOOGLE_ACTION_UPLOAD:
            return {
                ...state,
                driveUploadAction: action.driveUploadAction,
            };
        case SET_GOOGLE.REQ_GOOGLE_PARENT_DROP:
            return {
                ...state,
                parentDrop: action.parentDrop,
            };
        default:
            return state;
    }
}
