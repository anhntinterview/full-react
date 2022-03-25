import { useState, useEffect } from 'react';
import googleService from 'services/google.service';
import RestfulService from 'services/restful.service';
import { getAttrLocalStorage } from 'utils/handleLocalStorage';
import { toast } from 'react-toastify';
import { handleCreatePermissionWorkspaceDrive } from 'components/Workspace/WorkspaceInformation/WorkspaceListMembersFN';

// CONSTANTS
import { UPLOAD_FILE, UPLOAD_FOLDER } from 'constant/menu.const';
import { GOOGLE } from 'constant/google.const';

// MIDDLEWARE
import googleMiddleware from 'middleware/google.middleware';
import leftMenuMiddleware from 'middleware/leftMenu.middleware';
// TYPES
import { FormDataType, GoogleTypeFolder, TreeFolder } from 'types/GoogleType';
import { FileUpload } from 'types/LeftMenu.type';
import { GoogleFiles } from 'types/GoogleType';
import { WorkspaceMember } from 'types/GetListOfWorkspace.type';

export function oauth2Submit(
    param: { id: string; path?: string },
    email: string
) {
    return () => {
        const { id, path = '' } = param;

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
            state: JSON.stringify({
                id,
                path,
            }),
            include_granted_scopes: 'true',
            response_type: 'token',
            login_hint: email,
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

export const useGetWorkspaceDrive = (id: string, isCreator: boolean) => {
    const [loading, setIsLoading] = useState<boolean>(false);
    const [workspaceDriveId, setWorkspaceDriveId] = useState<string>('');
    useEffect(() => {
        setIsLoading(true);
        const q = isCreator
            ? `appProperties has {key="id" and value="${id}"}`
            : `sharedWithMe=true and appProperties has {key="id" and value="${id}"}`;
        googleService
            .getListGoogleDrive({
                q,
                fields: '*',
            })
            .then((res) => {
                console.log('asdasd', res);
                if (res?.files && res.files.length) {
                    const tmp = res.files[0];
                    setWorkspaceDriveId(tmp.id);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    return { loading, workspaceDriveId };
};

export const handleCreateWorkspaceDrive = async (
    id: string,
    isCreator: boolean
): Promise<GoogleFiles | undefined> => {
    const access_token = getAttrLocalStorage('access_token', 'google_auth');
    if (!isCreator || !access_token) return;

    const url = 'https://www.googleapis.com/drive/v3/files?fields=*';
    const req = await RestfulService.postBearerApi(url, access_token, {
        mimeType: 'application/vnd.google-apps.folder',
        parents: ['root'],
        name: `Workspace Drive ${id}`,
        appProperties: {
            id: id,
        },
    });
    const res = await req.json();
    if (req.ok) {
        toast.success('Create Workspace Drive successfully');
    }
    return res;
};

export const handleCreateMembersPermission = async (
    listMembers: WorkspaceMember[],
    workspaceDriveId: string
) => {
    const listRequest = listMembers.map((i) =>
        handleCreatePermissionWorkspaceDrive(
            workspaceDriveId,
            { fields: '*' },
            i.email
        )
    );

    Promise.all(listRequest)
        .then((res) => {
            if (res) {
                toast.success('Access granted to members');
            }
        })
        .catch((err) => toast.error(err));
};

let pathFile = '';

export function handleUploadFile(
    file: React.ChangeEvent<HTMLInputElement>,
    setUploadAction: React.Dispatch<React.SetStateAction<string | undefined>>,
    setFormDataGoogle: React.Dispatch<React.SetStateAction<FormDataType[]>>,
    param: string
) {
    if (file) {
        setFormDataGoogle([]);
        let id = 'root';
        if (file.target.files) {
            setUploadAction(UPLOAD_FILE);
            if (param) {
                id = param;
            }
            Array.from(file.target.files).forEach((d) => {
                const filemetaData: GoogleTypeFolder = {
                    name: d.name,
                    mimeType: d.type,
                    parents: [id],
                };
                const file: FormDataType = {
                    metadata: filemetaData,
                    file: d,
                };
                setFormDataGoogle((prevState) => [...prevState, file]);
            });
        }
    }
}
async function uploadFile(
    folders: TreeFolder,
    res: any,
    acceptedFiles: FileList,
    googleDispatch: React.Dispatch<any>,
    setFormDataGoogle: React.Dispatch<React.SetStateAction<FormDataType[]>>,
    parentName?: string
) {
    setFormDataGoogle([]);
    if (folders.children.length) {
        await uploadFolder(
            folders,
            res.id,
            acceptedFiles,
            googleDispatch,
            setFormDataGoogle,
            parentName
        );
    } else {
        const path = pathFile + '/' + folders.name;
        Array.from(acceptedFiles).forEach((d: any) => {
            if (d.webkitRelativePath.includes(path)) {
                const filemetaData: GoogleTypeFolder = {
                    name: d.name,
                    mimeType: d.type,
                    parents: [res?.id],
                };
                const file: FormDataType = {
                    metadata: filemetaData,
                    file: d,
                };
                setFormDataGoogle((prevState) => [...prevState, file]);
            }
        });
    }
}

async function uploadFolder(
    folders: TreeFolder,
    id: string,
    acceptedFiles: FileList,
    googleDispatch: React.Dispatch<any>,
    setFormDataGoogle: React.Dispatch<React.SetStateAction<FormDataType[]>>,
    parentName?: string
) {
    if (folders.name) {
        const newFolderGoogle = {
            mimeType: 'application/vnd.google-apps.folder',
            name: folders.name,
            parents: [id],
        };
        const res = await googleMiddleware.uploadNewFolderGoogleDrive(
            googleDispatch,
            newFolderGoogle
        );
        if (pathFile) {
            pathFile = parentName + '/' + folders.name;
        } else {
            pathFile = folders.name;
        }

        folders.children.map(async (d: any) => {
            await uploadFile(
                d,
                res,
                acceptedFiles,
                googleDispatch,
                setFormDataGoogle,
                folders.name
            );
        });
    }
}

export async function handleUploadFolder(
    folder: any,
    googleDispatch: React.Dispatch<any>,
    leftMenuDispatch: React.Dispatch<any>,
    setFormDataGoogle: React.Dispatch<React.SetStateAction<FormDataType[]>>,
    param: string
) {
    if (folder.target.files?.length) {
        setFormDataGoogle([]);
        let id = 'root';
        if (param) {
            id = param;
        }
        const theFiles: FileUpload[] = folder.target.files;
        const relativePath = theFiles[0].webkitRelativePath;
        const folderName = relativePath.split('/');

        const acceptedFiles = folder?.target?.files;

        const paths: any[] = [];
        const glob = {
            name: undefined,
            children: [],
            files: acceptedFiles,
        };
        const symbol = '/';
        const lookup = { [symbol]: glob };

        if (acceptedFiles) {
            Array.from(acceptedFiles).forEach((d: any) => {
                paths.push(d.webkitRelativePath);
            });

            paths.forEach(function (path) {
                path.split('/')
                    .slice(0)
                    .reduce((dir: any, sub: any) => {
                        if (!dir[sub]) {
                            const subObj = { name: sub, children: [] };
                            dir[symbol].children.push(subObj);
                            return (dir[sub] = { [symbol]: subObj });
                        }
                        return dir[sub];
                    }, lookup);
            });

            leftMenuMiddleware.setFolderName(leftMenuDispatch, folderName[0]);
            if (glob?.children.length) {
                await glob.children.map((d: any) => {
                    uploadFolder(
                        d,
                        id,
                        acceptedFiles,
                        googleDispatch,
                        setFormDataGoogle
                    );
                });
            }
        }
    }
}
