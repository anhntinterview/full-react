import React, { useEffect, useState, useContext } from 'react';
// PACKAGE
import { toInteger } from 'lodash';
import { useParams } from 'react-router-dom';
import { ViewGridIcon } from '@heroicons/react/solid';
import { ViewListIcon } from '@heroicons/react/outline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// COMPONENT
import WorkspaceFolderTable from 'components/Workspace/WorkspaceFolder/WorkspaceFolderTable';
// CONTEXT
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';
import { LeftMenuContext } from 'contexts/LeftMenu/LeftMenuContext';
// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';
import WorkspaceTitleViewFolder from 'components/Workspace/WorkspaceTitleViewFolder';
import googleMiddleware from 'middleware/google.middleware';

// TYPES
import {
    GoogleFiles,
    GoogleTypeFolder,
    FormDataType,
    TreeFolder,
} from 'types/GoogleType';

// CONST
// UTILS

// LOGIC
import {
    WorkspaceHomeContentProps,
    handleChangeView,
    notify,
    oauth2Submit,
    notifyUpload,
} from './WorkspaceHomeContentFn';
import ShareModal from '../ShareModal';
import { CREATE_FOLDER, UPLOAD_FILE, UPLOAD_FOLDER } from 'constant/menu.const';
import WorkspaceLoadingIndicator from './WorkspaceLoadingIndicator';
import Notification from 'components/Notification';
import { getGoogleAuthLocal } from 'utils/handleLocalStorage';

const WorkspaceHomeContent: React.FC<WorkspaceHomeContentProps> = ({
    setAuthStorage,
}) => {
    const [workspaceId, setWorkspaceId] = useState<string>();
    const [googleTokenErr, setGoogleTokenErr] = useState(false);
    // const [breadCrumb] = useState<
    //     { name: string; id: string }[]
    // >([{ name: 'Home', id: 'home' }]);

    const param: { id: string; type: string } = useParams();

    const { dispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );
    const {
        workspaceDriveId,
        result: WorkspaceDetailInformation,
    } = getWorkspaceDetailState;
    const typeQuery: Record<string, { q: string; title: string }> = {
        'my-drive': {
            q: `'root' in parents and trashed = false`,
            title: 'My Drive',
        },
        'shared-with-me': {
            q: 'sharedWithMe = true',
            title: 'Shared With Me',
        },
    };
    const [view, setView] = useState<boolean>(true);
    const [currentListFiles, setCurrentListFiles] = useState<GoogleFiles[]>([]);
    const [formDataGoogle, setFormDataGoogle] = useState<FormDataType[]>([]);
    // const [pathFile, setPathFile] = useState<string>('');

    const { dispatch: googleDispatch, googleState } = useContext(
        GoogleAPIAndServicesContext
    );
    const { dispatch: leftMenuDispatch, leftMenuState } = useContext(
        LeftMenuContext
    );

    let pathFile = '';

    const {
        isLoadingUpload,
        driveGoogleGetListResult,
        driveGoogleFolderResult,
        driveGoogleUploadFileResult,
        isLoadingList,
        updateStatus,
        target,
        destination,
        action: actionUpdate,
        errors,
        uploadStatus,
        localData,
        driveUploadAction,
        treeFolder,
    } = googleState;

    useEffect(() => {
        const { files: listFiles } = driveGoogleGetListResult;
        if (listFiles) {
            setCurrentListFiles(listFiles);
        }
    }, [driveGoogleGetListResult]);

    async function uploadFile(
        folders: TreeFolder,
        res: any,
        acceptedFiles: FileList,
        parentName?: string
    ) {
        setFormDataGoogle([]);
        if (folders.children.length) {
            await uploadFolder(folders, res.id, acceptedFiles, parentName);
        } else {
            const path = pathFile + '/' + folders.name;
            Array.from(acceptedFiles).forEach((d: any) => {
                if (d.path.includes(path)) {
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
        parentName?: string
    ) {
        if (folders.name && folders.children.length) {
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
                await uploadFile(d, res, acceptedFiles, folders.name);
            });
        } else if (folders.name && folders.children.length < 1) {
            Array.from(acceptedFiles).forEach((d: any) => {
                if (d.path === folders.name) {
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
                }
            });
        } else if (!folders.name && folders.children.length) {
            if (folders.children.length) {
                folders.children.map(async (d: any) => {
                    await uploadFolder(d, treeFolder.paramId, treeFolder.files);
                });
            }
        }
    }

    useEffect(() => {
        if (treeFolder.children.length) {
            treeFolder.children.map((d: any) => {
                uploadFolder(d, treeFolder.paramId, treeFolder.files);
            });
        }
    }, [treeFolder]);

    useEffect(() => {
        if (driveGoogleUploadFileResult) {
            switch (driveUploadAction) {
                case UPLOAD_FOLDER:
                    break;
                case UPLOAD_FILE:
                    Array.from(driveGoogleUploadFileResult).forEach((d) => {
                        setCurrentListFiles((prevState) => [d, ...prevState]);
                    });
                    break;
                case CREATE_FOLDER:
                    break;
                default:
                    break;
            }
        }
    }, [driveGoogleUploadFileResult]);

    useEffect(() => {
        if (driveGoogleFolderResult) {
            const newFolder: GoogleFiles = driveGoogleFolderResult;
            switch (driveUploadAction) {
                case CREATE_FOLDER:
                    setCurrentListFiles((prevState) => [
                        newFolder,
                        ...prevState,
                    ]);
                    break;

                case UPLOAD_FOLDER:
                    if (newFolder.name == leftMenuState.folderName) {
                        setCurrentListFiles((prevState) => [
                            newFolder,
                            ...prevState,
                        ]);
                    }
                    break;
                case UPLOAD_FILE:
                    break;

                default:
                    break;
            }
        }
    }, [driveGoogleFolderResult]);
    useEffect(() => {
        if (formDataGoogle.length) {
            googleMiddleware.uploadFileGoogleDrive(
                googleDispatch,
                formDataGoogle
            );
        }
    }, [formDataGoogle]);

    useEffect(() => {
        if (isLoadingUpload) {
            setFormDataGoogle([]);
        }
    }, [isLoadingUpload]);

    useEffect(() => {
        if (updateStatus) {
            notify(
                {
                    status: updateStatus,
                    target,
                    destination,
                    action: actionUpdate,
                },
                googleDispatch,
                errors
            )();
            let q = '';
            if (param.type && typeQuery[param.type]) {
                q = typeQuery[`${param.type}`].q;
            } else if (param.type === 'workspace-drive' && workspaceDriveId) {
                q = `"${workspaceDriveId}" in parents and trashed=false`;
            }
            // const q = typeQuery[param.type].q;
            googleMiddleware.getListGoogleDrive(googleDispatch, {
                q,
                fields: '*',
                orderBy: 'modifiedTime desc',
            });
            // history.go(0);
        }
    }, [updateStatus]);

    useEffect(() => {
        if (uploadStatus) {
            notifyUpload(uploadStatus, googleDispatch, errors)();
        }
    }, [uploadStatus]);

    useEffect(() => {
        // Get id
        const googleAuth = getGoogleAuthLocal();
        const { id } = param;
        let q = '';
        setWorkspaceId(id);
        if (id) {
            const convertId = toInteger(id);
            workspaceMiddleware.setWorkspaceId(dispatch, convertId);
        }
        // if (WorkspaceDetailInformation.id === -1) {
        //     workspaceMiddleware.getWorkspace(dispatch, {
        //         id: param.id,
        //     });
        // }
        if (googleAuth) {
            if (param.type && typeQuery[param.type]) {
                q = typeQuery[`${param.type}`].q;
            } else if (param.type === 'workspace-drive' && workspaceDriveId) {
                q = `"${workspaceDriveId}" in parents and trashed=false`;
            }
            if (q) {
                googleMiddleware.getListGoogleDrive(googleDispatch, {
                    q,
                    fields: '*',
                });
            }
        } else setGoogleTokenErr(true);

        return () => {
            setCurrentListFiles([]);
        };
    }, [param.type, workspaceDriveId]);

    return (
        <>
            <Notification
                isNotify={googleTokenErr}
                setIsNotify={setGoogleTokenErr}
            />
            <ToastContainer />
            <div className="px-ooolab_p_16 pt-ooolab_p_5 w-full h-ooolab_h_user_detail">
                <p className="text-ooolab_base flex items-center">
                    {typeQuery[param.type]?.title || ''}
                    {isLoadingList && <WorkspaceLoadingIndicator />}
                </p>
                <div className="flex w-full">
                    <p className="w-4/5 text-ooolab_xs font-semibold mb-ooolab_m_4 flex" />
                    <div className="w-1/5 flex justify-end">
                        {view ? (
                            <button
                                className="focus:outline-none"
                                onClick={handleChangeView(setView, view)}
                            >
                                <ViewGridIcon className="h-ooolab_h_6 w-ooolab_w_6 text-blue-400" />
                            </button>
                        ) : (
                            <button
                                className="focus:outline-none"
                                onClick={handleChangeView(setView, view)}
                            >
                                <ViewListIcon className="h-ooolab_h_6 w-ooolab_w_6 text-blue-400" />
                            </button>
                        )}
                    </div>
                </div>

                {view ? (
                    <>
                        <WorkspaceFolderTable
                            hasShared={param.type === 'shared-with-me'}
                            hasCollab={param.type !== 'shared-with-me'}
                            data={currentListFiles || []}
                        />
                    </>
                ) : (
                    <>
                        <WorkspaceTitleViewFolder
                            data={currentListFiles || []}
                        />
                    </>
                )}
                {/* {isCreateFolder && (
                    <CreateFolder
                        isCreateFolder={isCreateFolder}
                        setIsCreateFolder={setIsCreateFolder}
                    />
                )} */}
            </div>
            <ShareModal setAuthStorage={setAuthStorage} />
        </>
    );
};

export default WorkspaceHomeContent;
