import { GoogleState, GoogleServerSideState } from 'types/GoogleType';

export const initGoogleServerSideState: GoogleServerSideState = {
    isLoading: true,

    getDriveAuthentiacteUrlResult: undefined,
    getDriveAuthentiacteUrlResponseError: undefined,
    getDriveAuthentiacteUrlResponseValidateError: undefined,

    authentiacteWithDriveResult: undefined,
    authentiacteWithDriveResponseError: undefined,
    authentiacteWithDriveResponseValidateError: undefined,

    getDriveCredentialOfWorkspaceResult: undefined,
    getDriveCredentialOfWorkspaceResponseError: undefined,
    getDriveCredentialOfWorkspaceResponseValidateError: undefined,

    params: '',
    status: '',
};

export const initGoogleState: GoogleState = {
    isLoading: true,

    isLoadingList: false,

    isLoadingUpload: false,

    isLoadingCreate: false,

    driveGoogleGetListResult: {
        files: [],
        incompleteSearch: false,
        kind: '',
        nextPageToken: '',
    },

    driveUploadAction: '',

    driveGoogleGetListErr: undefined,

    driveGoogleUploadFileResult: [],

    driveGoogleFolderResult: {
        modifiedTime: '',
        kind: '',
        id: '',
        name: '',
        mimeType: '',
        hasThumbnail: false,
        thumbnailLink: '',
        isAppAuthorized: false,
        capabilities: {
            canAddChildren: false,
            canShare: false,
            canCopy: false,
        },
        permissions: [],
        parents: [],
        shared: false,
        owners: [],
        shortcutDetails: {
            targetId: '',
            targetMimeType: '',
        },
        trashed: false,
    },

    localData: {
        nestedFolder: [],
        parentsFolder: [],
        files: [],
    },
    treeFolder: {
        name: undefined,
        children: [],
        files: [],
        paramId: '',
    },
    parentDrop: {
        files: [],
        folders: [],
    },

    driveGoogleFolderErr: undefined,
    uploadStatus: '',
    params: '',
    status: '',
    updateStatus: '',
    target: '',
    targetId: '',
    destination: '',
    action: '',
    contextAction: '',

    shareStatus: '',

    fileDetail: undefined,
    isLoadingFile: false,
    fileStatus: '',
    getFileErrors: undefined,
    deletingId: '',

    errors: undefined,
};
