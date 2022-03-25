export const GOOGLE = {
    API_AND_SERVICES: {
        CREDENTIALS: {
            OAUTH2: {
                CLIENT_ID:
                    '1041211040505-9kar2tkuj0u0krf2tik4vb7t8stea4uu.apps.googleusercontent.com',
                AUTHORIZED_REDIRECT_URIs: process.env.REACT_APP_GOOGLE_DIRECT,
            },
        },
        SCOPE: {
            DRIVE: {
                METADATA_READONLY:
                    'https://www.googleapis.com/auth/drive.metadata.readonly',
                FULL: 'https://www.googleapis.com/auth/drive',
                FILES: 'https://www.googleapis.com/auth/drive.file',
                FOLDER: 'https://www.googleapis.com/auth/drive.appdata',
            },
        },
        API: {
            OAUTH2: 'https://accounts.google.com/o/oauth2/v2/auth',
            USER: {
                GET_USERS:
                    'https://www.googleapis.com/drive/v3/about?fields=user',
                // Next API...
            },
            DRIVE: 'https://www.googleapis.com/drive/v3',
            FOLDER: 'https://www.googleapis.com/drive/v3/files',
            FILE_UPLOAD:
                'https://www.googleapis.com/upload/drive/v3/files?uploadType=',
        },
    },
    IAM_AND_ADMIN: {
        PROJECT: {
            NAME: 'OOOLAB Google Drive',
            ID: 'proven-concept-316907',
            NUMBER: '416532671191',
        },
    },
};

export const LOCAL_STORAGE_GOOGLE = {
    OAUTH2_PARAMS: 'google_auth',
};

export const MIME_TYPE: Record<any, string> = {
    'text/html': 'HTML',
    'application/zip': 'HTML (zipped)',
    'text/plain': 'Plain text',
    'application/rtf': 'Rich text',
    'application/vnd.oasis.opendocument.text': 'Open Office doc',
    'application/pdf': 'PDF',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        'MS Word document',
    'application/epub+zip': 'EPUB',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        'MS Excel',
    'application/x-vnd.oasis.opendocument.spreadsheet': 'Open Office sheet',
    'text/csv': 'CSV (first sheet only)',
    'text/tab-separated-values': '(sheet only)',
    'image/jpeg': 'JPEG',
    'image/png': 'PNG',
    'image/svg+xml': 'SVG',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        'MS PowerPoint',
    'application/vnd.oasis.opendocument.presentation':
        'Open Office presentation',
    'application/vnd.google-apps.script+json': 'JSON',
    'application/vnd.google-apps.document': 'Google Docs',
    'application/vnd.google-apps.drive-sdk': '3rd party shortcut',
    'application/vnd.google-apps.drawing': 'Google Drawing',
    'application/vnd.google-apps.file': 'Google Drive file',
    'application/vnd.google-apps.form': 'Google Forms',
    'application/vnd.google-apps.fusiontable': 'Google Fusion Tables',
    'application/vnd.google-apps.map': 'Google My Maps',
    'application/vnd.google-apps.photo': 'Google Photo',
    'application/vnd.google-apps.presentation': 'Google Slides',
    'application/vnd.google-apps.script': 'Google Apps Scripts',
    'application/vnd.google-apps.shortcut': 'Shortcut',
    'application/vnd.google-apps.site': 'Google Sites',
    'application/vnd.google-apps.spreadsheet': 'Google Sheets',
    'application/vnd.google-apps.folder': 'Google Drive folder',
};

export const shareOptions = [
    {
        value: 'writer',
        label: 'can edit',
    },
    {
        value: 'reader',
        label: 'can view',
    },
    {
        value: 'commenter',
        label: 'comment',
    },
];

export const PICKER_KEY = {
    REACT_APP_GOOGLE_CLIENT_ID:
        '1041211040505-9kar2tkuj0u0krf2tik4vb7t8stea4uu.apps.googleusercontent.com',
    REACT_APP_DEVELOPER_KEY: 'AIzaSyD6TUJoPmVSal8DbATrtf7a0q0v4N4TnVo',
};
