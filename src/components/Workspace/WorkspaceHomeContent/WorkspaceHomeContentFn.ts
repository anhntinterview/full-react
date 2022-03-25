// PACKAGE
import {toast} from 'react-toastify';
// CONSTANTS
import {GOOGLE} from 'constant/google.const';
// MIDDLEWARE
import googleMiddleware from 'middleware/google.middleware';
// TYPES
import {
    GoogleResponseError,
    RedirectUrlPage,
} from 'types/GoogleType';

export const handleClickFolder: (
    {
        id,
        type,
        name,
    }: {
        id: string;
        type: string;
        name: string;
    },
    setBreadCrumb: React.Dispatch<React.SetStateAction<{
        name: string;
        id: string;
    }[]>>,
    breadCrumb: {
        name: string;
        id: string;
    }[],
    googleDispatch: React.Dispatch<any>
) => () => void = (
    {
        id,
        type,
        name,
    }: {
        id: string;
        type: string;
        name: string;
    },
    setBreadCrumb: React.Dispatch<React.SetStateAction<{
        name: string;
        id: string;
    }[]>>,
    breadCrumb: {
        name: string;
        id: string;
    }[],
    googleDispatch: React.Dispatch<any>
) => {
    return () => {
        if (type.includes('folder')) {
            setBreadCrumb([...breadCrumb, {name, id}]);
            googleMiddleware.getListGoogleDrive(googleDispatch, {
                fields: '*',
                q: `'${id}' in parents and trashed = false`,
                orderBy: 'folder,modifiedTime desc',
            });
        }
    };
};

export function handleChangeView(
    setView: (value: React.SetStateAction<boolean>) => void,
    view: boolean
) {
    return () => {
        setView(!view);
    };
}

export const notify = (
    {status, target, destination, action}: ToastType,
    googleDispatch: React.Dispatch<any>,
    errors: GoogleResponseError | undefined
) => {
    return () => {
        if (status === 'done' && action === 'move') {
            return toast.success(
                `You move ${
                    target.length < 10 ? target : `${target.slice(0, 10)}`
                } into ${
                    destination.length < 10
                        ? destination
                        : `${destination.slice(0, 10)}`
                } successfully!`,
                {
                    position: 'bottom-left',
                    onClose: () =>
                        googleMiddleware.resetUpdateFileToast(googleDispatch),
                }
            );
        } else if (status === 'done' && action === 'delete') {
            return toast.dark(
                `You moved ${target} to trash bin!`,
                {
                    position: 'bottom-left',
                    style: {
                        width: 'fit-content',
                    },
                    bodyStyle: {
                        whiteSpace: 'pre-line',
                    },
                    onClose: () =>
                        googleMiddleware.resetUpdateFileToast(googleDispatch),
                }
            );
        } else
            return toast.error(errors?.error.message, {
                position: 'bottom-left',
                onClose: () =>
                    googleMiddleware.resetUpdateFileToast(googleDispatch),
            });
    };
};

export const notifyUpload = (
    status: string,
    googleDispatch: React.Dispatch<any>,
    errors: GoogleResponseError | undefined
) => {
    return () => {
        if (status === 'done') {
            return toast.success('Upload success!', {
                position: 'bottom-left',
            });
        } else
            return toast.error(errors?.error.message, {
                position: 'bottom-left',
                onClose: () =>
                    googleMiddleware.resetUpdateFileToast(googleDispatch),
            });
    };
};

export function handleClickBreadCrumb(
    id: string,
    googleDispatch: React.Dispatch<any>,
    setBreadCrumb: React.Dispatch<React.SetStateAction<{
        name: string;
        id: string;
    }[]>>,
    breadCrumb: {
        name: string;
        id: string;
    }[]
) {
    return () => {
        if (id === 'home') {
            setBreadCrumb(initialBreadCrumb);
            googleMiddleware.getListGoogleDrive(googleDispatch, {
                fields: '*',
                q: `'root' in parents and trashed = false`,
                orderBy: 'folder,modifiedTime desc',
            });
        } else if (id) {
            const copyBreadCrumb = [...breadCrumb];
            const targetId = copyBreadCrumb.findIndex((i) => i.id === id);
            const temp = copyBreadCrumb.slice(0, targetId + 1);
            setBreadCrumb(temp);
            googleMiddleware.getListGoogleDrive(googleDispatch, {
                fields: '*',
                q: `'${id}' in parents and trashed = false`,
                orderBy: 'folder,modifiedTime desc',
            });
        }
    };
}

export function oauth2Submit(param: { id: string }) {
    return () => {
        const {id} = param;

        // Google's OAuth 2.0 endpoint for requesting an access token
        const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

        // Create element to open OAuth 2.0 endpoint in new window.
        const form = document.createElement('form');
        form.setAttribute('method', 'GET'); // Send as a GET request.
        form.setAttribute('action', oauth2Endpoint);

        // Parameters to pass to OAuth 2.0 endpoint.
        const params: any = {
            client_id: GOOGLE.API_AND_SERVICES.CREDENTIALS.OAUTH2.CLIENT_ID,
            redirect_uri:
            GOOGLE.API_AND_SERVICES.CREDENTIALS.OAUTH2
                .AUTHORIZED_REDIRECT_URIs,
            // redirect_uri: 'http://localhost:3000/google/login',
            scope: 'https://www.googleapis.com/auth/drive',
            state: id,
            include_granted_scopes: 'true',
            response_type: 'token',
        };

        // Add form parameters as hidden input values.
        for (const p in params) {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }

        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
    };
}

export interface WorkspaceHomeContentProps {
    empty?: string;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    // isCreateFolder: boolean;
    // setIsCreateFolder: React.Dispatch<React.SetStateAction<boolean>>;
    // // checkTokenGoogle: boolean;
    // // setCheckTokenGoogle: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface LocationState {
    to: {
        redirectUrlWorkspace: RedirectUrlPage;
    };
}

export interface ToastType {
    status: string;
    target: string;
    destination: string;
    action: string;
}

export const initialBreadCrumb = [{id: 'home', name: 'Home'}];
