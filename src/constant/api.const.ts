export const HOST_URL = process.env.REACT_APP_API_ENDPOINT;

// *** USER *** //
export const USER = {
    CREATE_TEMPORARY_USER: '/users',
    CREATE_NEW_PASSWORD: '/users/me/password',
    UPDATE_PASSWORD: '/users/me/password',
    GET_USER: '/users/me',
    UPDATE_USER: '/users/me',
    UPLOAD_AVATAR: '/resources/upload-url',
    UPLOAD_AVATAR_FORM_DATA: 'https://cdn-crisp-tarpon.s3.amazonaws.com/',
    UPLOAD_AVATR_FINAL: '/users/me/avatar',
};

// *** AUTHENTICATE *** //
export const AUTH = {
    VERIFY_EMAIL: '/auth/email',
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    LOGOUT: '/auth/logout',
};

// *** WORKSPACE *** //
export const WORKSPACE = {
    GET_CURRENT_USER_OF_WORKSPACE: '/workspaces/me',
    CREATE_WORKSPACE: '/workspaces',
    INVITE_WORKSPACE: (workspaceId: number) =>
        `/workspaces/${workspaceId}/members`,
    GET_WORKSPACE_DETAIL: (workspaceId: string) => `/workspaces/${workspaceId}`,
    GET_WORKSPACE_MEMBERS: (workspaceId?: string) =>
        `/workspaces/${workspaceId}/members`,
};

// *** GOOGLE API *** //
export const GOOGLE_SERVER_SIDE = {
    LOCAL_STORAGE: {
        GOOGLE_REDIRECT_URL_WORKSPACE_ID: 'google_redirect_url_workspace_id',
        GOOGLE_OAUTH_TOKEN: 'google_oauth_token',
    },
    OAUTH2: {
        GET_DRIVE_AUTHENTICATE_URL: (workspaceId: string) =>
            `/workspaces/${workspaceId}/drive-auth`,
        AUTHENTICATE_WITH_DRIVE: (workspaceId: string) =>
            `/workspaces/${workspaceId}/drive-auth`,
        GET_DRIVE_CREDENTIALS_OF_WORKSPACE: (workspaceId: string) =>
            `/workspaces/${workspaceId}/drive-credentials`,
    },
    DRIVER: {
        URL: 'https://www.googleapis.com/drive/v3/files/',
    },
};

export const ERROR_LOGOUT_MSG = {
    COULD_NOT_VERIFY_AUTHORIZED: `The server could not verify that you are authorized to access the URL requested. You either supplied the wrong credentials (e.g. a bad password), or your browser doesn't understand how to supply the credentials required.`,
};

// *** H5P *** //
export const H5P = {
    root: (workpspaceId: string) => `/h5p/workspaces/${workpspaceId}`,
    play: (contentId: string) => `/${contentId}/play`,
    delete: (contentId: string) => `/${contentId}/trash`,
    save: (contentId: string) => `/${contentId}`,
    edit: (contentId: string) => `/${contentId}/edit`,
    download: (contentId: string) => `/download/${contentId}`,
    approveContent: (contentId: string) => `/${contentId}/approve`,
    uidPlay: (contentUid: string) => `/h5p/${contentUid}/play`,
    addTags: (contentId: string) => `/${contentId}/tags`,
    Tags: (contentId: string) => `/${contentId}/tags`,
};

export const CLASS = {
    create: (workspaceId: string) => `/workspaces/${workspaceId}/classes`,
    getList: (workspaceId: string) => `/workspaces/${workspaceId}/classes`,
    getDetail: (workspaceId: string, classId: string) =>
        `/workspaces/${workspaceId}/classes/${classId}`,
    update: (workspaceId: string, classId: string) =>
        `/workspaces/${workspaceId}/classes/${classId}`,
    delete: (workspaceId: string, classId: string) =>
        `/workspaces/${workspaceId}/classes/${classId}/status`,
    deactive: (workspaceId: string, classId: string) =>
        `/workspaces/${workspaceId}/classes/${classId}/status`,

    getListSession: (workspaceId: string, classId: string) =>
        `/workspaces/${workspaceId}/classes/${classId}/sessions`,

    inviteMembers: (workspaceId: string, classId: string) =>
        `/workspaces/${workspaceId}/classes/${classId}/members`,
    removeMembers: (workspaceId: string, classId: string, userId: number) =>
        `/workspaces/${workspaceId}/classes/${classId}/members/${userId}`,
    deleteSession: (workspaceId: string, classId: string, sessionId: string) =>
        `/workspaces/${workspaceId}/classes/${classId}/sessions/${sessionId}`,
    updateSessions: (workspaceId: string, classId: string, sessionId: string) =>
        `/workspaces/${workspaceId}/classes/${classId}/sessions/${sessionId}`,
};

export const REPORT = {
    getGeneral: (workspaceId: string) => `/workspaces/${workspaceId}/reports/dashboards/general`,
    getTeacher: (workspaceId: string) => `/workspaces/${workspaceId}/reports/dashboards/teacher`
};
