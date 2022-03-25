import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ViewGridIcon, ViewListIcon } from '@heroicons/react/solid';

//CONTEXT AND MIDDLEWARE
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';
import googleMiddleware from 'middleware/google.middleware';

//COMPONENTS
import WorkspaceBreadCrumb from 'components/Workspace/WorkspaceBreadCrumb';
import WorkspaceFolderTable from 'components/Workspace/WorkspaceFolder/WorkspaceFolderTable';
import WorkspaceTitleViewFolder from 'components/Workspace/WorkspaceTitleViewFolder';
import {
    FormDataType,
    GoogleFiles,
    GoogleTypeFolder,
    TreeFolder,
} from 'types/GoogleType';
import ShareModal from '../ShareModal';

import { ToastContainer } from 'react-toastify';
import {
    CREATE_FOLDER,
    DROP,
    UPLOAD_FILE,
    UPLOAD_FOLDER,
} from 'constant/menu.const';
import { LeftMenuContext } from 'contexts/LeftMenu/LeftMenuContext';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { getGoogleAuthLocal } from 'utils/handleLocalStorage';
import Notification from 'components/Notification';

interface WorkspaceFolderViewProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const WorkspaceFolderView: React.FC<WorkspaceFolderViewProps> = ({
    setAuthStorage,
}) => {
    const [workspaceDriveErr, setWorkspaceDriveErr] = useState<
        'google' | 'workspace' | undefined
    >();
    const params: { id: string } = useParams();
    const history = useHistory();

    const [view, setView] = useState<boolean>(false);
    const [currentListFiles, setCurrentListFiles] = useState<GoogleFiles[]>([]);

    const { dispatch: googleDispatch, googleState } = useContext(
        GoogleAPIAndServicesContext
    );
    const {
        dispatch: WorkspaceDispatch,
        getWorkspaceDetailState: { result: workspaceDetailInformation },
    } = useContext(GetWorkspaceContext);
    const { drive_default_path } = workspaceDetailInformation;

    const [formDataGoogle, setFormDataGoogle] = useState<FormDataType[]>([]);

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
        parentDrop,
    } = googleState;

    // useEffect(() => {
    //     if (workspaceDetailInformation.id === -1) {
    //         workspaceMiddleware.getWorkspace(WorkspaceDispatch, {
    //             id: params.id,
    //         });
    //     }
    // }, []);
    useEffect(() => {
        const googleAuth = getGoogleAuthLocal();
        if (!googleAuth) {
            setWorkspaceDriveErr('google');
            return;
        }
        if (!drive_default_path && workspaceDetailInformation.id !== -1) {
            setWorkspaceDriveErr('workspace');
            return;
        }
        if (googleAuth && drive_default_path) {
            googleMiddleware.getListGoogleDrive(googleDispatch, {
                fields: '*',
                orderBy: 'folder,modifiedTime desc',
                q: `'${drive_default_path}' in parents and trashed = false`,
            });
        }
    }, [drive_default_path]);

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
        if (formDataGoogle.length) {
            googleMiddleware.uploadFileGoogleDrive(
                googleDispatch,
                formDataGoogle
            );
        }
    }, [formDataGoogle]);

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
                case DROP:
                    Array.from(driveGoogleUploadFileResult).forEach((d) => {
                        parentDrop.files.map((name) => {
                            if (d.name === name) {
                                setCurrentListFiles((prevState) => {
                                    return [d, ...prevState];
                                });
                            }
                        });
                    });

                    break;
                default:
                    break;
            }
        }
    }, [driveGoogleUploadFileResult]);

    useEffect(() => {
        if (driveGoogleFolderResult?.id && driveUploadAction) {
            const newFolder: GoogleFiles = driveGoogleFolderResult;

            switch (driveUploadAction) {
                case CREATE_FOLDER:
                    setCurrentListFiles((prevState) => [
                        newFolder,
                        ...prevState,
                    ]);
                    break;

                case UPLOAD_FOLDER:
                    if (newFolder.name === leftMenuState.folderName) {
                        setCurrentListFiles((prevState) => {
                            return [newFolder, ...prevState];
                        });
                    }
                    break;
                case UPLOAD_FILE:
                    break;
                case DROP:
                    parentDrop.folders.map((name) => {
                        if (newFolder.name === name) {
                            setCurrentListFiles((prevState) => {
                                return [newFolder, ...prevState];
                            });
                        }
                    });

                    break;
                default:
                    break;
            }
        }
    }, [driveGoogleFolderResult, driveUploadAction]);

    useEffect(() => {
        const { files: listFiles } = driveGoogleGetListResult;
        if (listFiles) {
            setCurrentListFiles(listFiles);
        }
    }, [driveGoogleGetListResult]);

    useEffect(() => {
        if (updateStatus) {
            // notify(
            //     {
            //         status: updateStatus,
            //         target,
            //         destination,
            //         action: actionUpdate,
            //     },
            //     googleDispatch,
            //     errors
            // )();
            googleMiddleware.getListGoogleDrive(googleDispatch, {
                q: `'${drive_default_path}' in parents and trashed = false`,
                fields: '*',
                orderBy: 'modifiedTime desc',
            });
        }
    }, [updateStatus]);

    return (
        <div className="px-ooolab_p_16 py-ooolab_p_3">
            <Notification
                isNotify={workspaceDriveErr === 'google'}
                setIsNotify={() => setWorkspaceDriveErr(undefined)}
            />
            <ToastContainer />
            <p>Workspace Drive</p>
            {/* {drive_default_path && <WorkspaceBreadCrumb path={drive_default_path} />} */}
            <div className="flex w-full">
                <p className="w-4/5 text-ooolab_xs font-semibold mb-ooolab_m_4 flex">
                    {/* {isLoadingList && (
                        <svg
                            className="animate-spin mr-3 w-ooolab_w_4 h-ooolab_h_4 ml-3"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    )} */}
                </p>
                <div className="w-1/5 flex justify-end">
                    {view ? (
                        <button
                            className="focus:outline-none"
                            onClick={() => setView(false)}
                        >
                            <ViewGridIcon className="h-ooolab_h_6 w-ooolab_w_6 text-blue-400" />
                        </button>
                    ) : (
                        <button
                            className="focus:outline-none"
                            onClick={() => setView(true)}
                        >
                            <ViewListIcon className="h-ooolab_h_6 w-ooolab_w_6 text-blue-400" />
                        </button>
                    )}
                </div>
            </div>
            {workspaceDriveErr === 'workspace' ? (
                <div>No Workspace Drive found. Please contact admin!</div>
            ) : view ? (
                <>
                    <WorkspaceFolderTable data={currentListFiles || []} />
                </>
            ) : (
                <>
                    <WorkspaceTitleViewFolder data={currentListFiles || []} />
                </>
            )}
            <ShareModal setAuthStorage={setAuthStorage} />
        </div>
    );
};

export default WorkspaceFolderView;
