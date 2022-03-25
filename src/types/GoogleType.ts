import {
    AuthenticateType,
    NormalResponseError,
    ValidateResponseErrors,
    IObjectKeys,
} from './Common.type';

// Google Services & API SERVER SIDE
export type RedirectUrlPage = {
    state: string;
    workspaceUrl: string;
    workspaceId: string;
    code: string | undefined;
};
export interface GoogleServerSideState {
    isLoading: boolean;
    getDriveAuthentiacteUrlResult:
        | {
              authentication_url: string;
              state: string;
          }
        | undefined;
    getDriveAuthentiacteUrlResponseError: NormalResponseError | undefined;
    getDriveAuthentiacteUrlResponseValidateError:
        | ValidateResponseErrors
        | undefined;

    authentiacteWithDriveResult: number | undefined;
    authentiacteWithDriveResponseError: NormalResponseError | undefined;
    authentiacteWithDriveResponseValidateError:
        | ValidateResponseErrors
        | undefined;

    getDriveCredentialOfWorkspaceResult:
        | {
              token: string;
              scopes: string[];
          }
        | undefined;
    getDriveCredentialOfWorkspaceResponseError: NormalResponseError | undefined;
    getDriveCredentialOfWorkspaceResponseValidateError:
        | ValidateResponseErrors
        | undefined;

    params: string;
    status: string;
}
export interface GetDriveAuthentiacteUrlOAuth2ArgsType
    extends AuthenticateType {
    workspace_id: string;
}
export interface AuthentiacteWithDriveOAuth2ArgsType extends AuthenticateType {
    workspace_id: string;
    state: string;
    code: string;
}
export interface GetDriveCredentialOfWorkspaceOAuth2ArgsType
    extends AuthenticateType {
    workspace_id: string;
}

export interface GoogleServerSideAction extends GoogleServerSideState {
    type: string;
}

// Google Services & API CLIENT SIDE
export interface GoogleOAuth2ArgsType extends IObjectKeys {
    client_id: string;
    redirect_uri: string;
    scope: string;
    state: string;
    include_granted_scopes: string;
    response_type: string;
}
export interface GoogleDriveArgsType {
    fields?: string;
    q?: string;
    orderBy?: string;
}
export interface GoogleDriveResult {}

export interface GoogleState {
    isLoading: boolean;
    isLoadingList: boolean;
    isLoadingUpload: boolean;
    isLoadingCreate: boolean;
    driveGoogleGetListResult: GoogleFilesResponse;

    driveGoogleGetListErr: undefined;

    driveUploadAction: string;

    driveGoogleFolderResult: GoogleFiles;

    driveGoogleFolderErr: undefined;

    driveGoogleUploadFileResult: GoogleFiles[];

    localData: MultipleFolderType;
    treeFolder: TreeFolder;

    parentDrop: ParentFile;

    params: string;
    status: string;

    uploadStatus: string;

    updateStatus: string;
    // target name and destination when move a file
    target: string;
    targetId: string;
    destination: string;
    //define action when update a file: move, delete, ...etc
    action: string;

    contextAction: string;

    //state for share file
    shareStatus: string;

    //state for get files
    isLoadingFile: boolean;
    fileDetail: GoogleFiles | undefined;
    deletingId: string;
    fileStatus: string;
    getFileErrors: GoogleResponseError | undefined;

    errors: GoogleResponseError | undefined;
}
export interface GoogleAction extends GoogleState {
    type: string;
}

export type GoogleAuthLocal = {
    access_token: string | undefined;
    expires: string | undefined;
    scope: string | undefined;
    state: string | undefined;
    token_type: string | undefined;
};

export interface GoogleFileUser {
    kind: string;
    id: string;
    type: string;
    emailAddress: string;
    role: string;
    displayName: string;
    photoLink: string;
    deleted: string;
}
export interface GoogleFiles {
    modifiedTime: string;
    kind: string;
    id: string;
    name: string;
    mimeType: string;
    hasThumbnail: boolean;
    thumbnailLink: string;
    isAppAuthorized: boolean;
    capabilities: {
        canAddChildren: boolean;
        canShare: boolean;
        canCopy: boolean;
    };
    permissions: GoogleFileUser[];
    parents: string[];
    shared: boolean;
    owners: GoogleFileUser[];
    shortcutDetails: {
        targetId: string;
        targetMimeType: string;
    };
    trashed: boolean;
    webViewLink: string;
}

export interface GoogleFilesResponse {
    kind: string;
    nextPageToken: string;
    incompleteSearch: boolean;
    files: GoogleFiles[];
}

export interface GoogleResponseError {
    error: {
        errors: {
            domain: string;
            reason: string;
            message: string;
        }[];
        code: number;
        message: string;
    };
}

// GOOGLE API
export interface UpdateFilesArgs {
    fieldId: string;
    // query params
    args: Record<string, any>;
    action: string;
    // information file and destination
    files: {
        target: string;
        targetId: string;
        destination: string;
    };
    body?: Record<string, any>;
}

export interface TypeFolder {
    id: string;
}

export interface GoogleTypeFolder {
    name: string;
    mimeType: string;
    parents?: string[];
    shortcutDetails?: {
        targetId: string;
    };
}

export interface GoogleFolderReponse {
    id: string;
    kind: string;
    mimeType: string;
    name: string;
}

export interface FormDataType {
    metadata: GoogleTypeFolder;
    file: File;
}

export interface NestedFolderType {
    folder: {
        name: string;
        files: (File | string)[];
    };
}
export interface subFolderType {
    name: string;
    path: string;
}
export interface FolderType {
    parentFolderName: string;
    subFolder: string[];
}

export interface MultipleFolderType {
    parentsFolder: FolderType[];
    nestedFolder: NestedFolderType[];
    files: File[];
}
export interface GoogleUpdatePermissionBody {
    role:
        | 'owner'
        | 'organizer' //add onother people to shared drive
        | 'fileOrganizer'
        | 'writer' // can share this file to another
        | 'commenter' // can comment
        | 'reader'; // read-only
}

export interface GooglePermission {
    emailAddress: string;
    id: string;
    type: string;
}

export interface GooglePermissionResponse {
    kind: string;
    permissions: GooglePermission[];
}
export interface TreeFolder {
    name: string | undefined;
    children: any[];
    files: FileList;
    paramId: string;
}

export interface ParentFile {
    files: string[];
    folders: string[];
}
