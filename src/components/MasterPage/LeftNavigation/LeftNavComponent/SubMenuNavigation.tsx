import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { Disclosure } from '@headlessui/react';
import { ArrowRightIcon, ChevronRightIcon } from '@heroicons/react/outline';
import CreateFolder from 'components/GoogleDriver/CreateFolder';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { FormDataType, GoogleTypeFolder, TreeFolder } from 'types/GoogleType';
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';
import { LeftMenuContext } from 'contexts/LeftMenu/LeftMenuContext';
import Notification from 'components/Notification';
import { AuthContext } from 'contexts/Auth/AuthContext';
import googleMiddleware from 'middleware/google.middleware';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { UPLOAD_FILE, UPLOAD_FOLDER } from 'constant/menu.const';
import leftMenuMiddleware from 'middleware/leftMenu.middleware';
import { FileUpload } from 'types/LeftMenu.type';
import { useTranslation } from 'react-i18next';

export interface SubMenuNavigationProps {
    bar: any;
    setSelectedMenu: React.Dispatch<React.SetStateAction<number>>;
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

const SubMenuNavigation: React.FC<SubMenuNavigationProps> = ({
    bar,
    setSelectedMenu,
}) => {
    const { t: translator } = useTranslation();

    const history = useHistory();
    const userInfo = getLocalStorageAuthData();
    const { access_token } = userInfo;
    const param: { id: string; type?: string; folderId: string } = useParams();
    const checkGoogleAuth = localStorage.getItem('google_auth');
    const [isModal, setIsModal] = useState<boolean>(false);
    const file = useRef<any>();
    const folder = useRef<any>();
    const [formDataGoogle, setFormDataGoogle] = useState<FormDataType[]>([]);
    const { dispatch: GoogleDispatch, googleState } = React.useContext(
        GoogleAPIAndServicesContext
    );
    const { dispatch: leftMenuDispatch, leftMenuState } = React.useContext(
        LeftMenuContext
    );
    const [isNotify, setIsNotify] = useState<boolean>(false);
    const {
        dispatch: workspaceDispatch,
        getWorkspaceDetailState,
    } = React.useContext(GetWorkspaceContext);
    const {
        members,
        isCreator,
        workspaceDriveId,
        result: WorkspaceDetailInformation,
    } = getWorkspaceDetailState;
    const authCtx = useContext(AuthContext);
    const authDispatch = authCtx.dispatch;
    const [isCreateFolder, setIsCreateFolder] = useState<boolean>(false);

    useEffect(() => {
        async function sync() {
            if (formDataGoogle.length) {
                await googleMiddleware.uploadFileGoogleDrive(
                    GoogleDispatch,
                    formDataGoogle
                );
                // history.push(`/workspace/${param.id}/my-drive`);
            }
        }

        sync();
    }, [formDataGoogle]);

    const userDataLocalStorage = getLocalStorageAuthData();
    useEffect(() => {
        if (members.items && members.items.length) {
            const { items: listMembers } = members;
            const currentUser = listMembers.filter(
                (i) =>
                    i.email === userDataLocalStorage.email &&
                    i.name === userDataLocalStorage.name
            );
            const userRole = currentUser[0]?.membership.role.toLocaleLowerCase();
            const isCreator = currentUser[0]?.membership.is_creator;
            workspaceMiddleware.setUserRole(workspaceDispatch, userRole);
            workspaceMiddleware.setUserWorkspaceCreator(
                workspaceDispatch,
                isCreator
            );
        }
    }, [members]);
    let pathFile = '';
    function handleFileInput(file: React.ChangeEvent<HTMLInputElement>) {
        if (file) {
            setFormDataGoogle([]);
            let id = 'root';

            if (file.target.files) {
                // setUploadAction(UPLOAD_FILE);
                googleMiddleware.actionUpload(GoogleDispatch, UPLOAD_FILE);
                const pathName = location.pathname;
                if (
                    pathName.includes('workspace-drive') &&
                    WorkspaceDetailInformation.drive_default_path
                ) {
                    id = WorkspaceDetailInformation.drive_default_path;
                } else if (param.folderId) {
                    id = param.folderId;
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
    function handleCreateFolder() {
        if (checkGoogleAuth) {
            setIsCreateFolder(true);
        } else if (!checkGoogleAuth) {
            setIsNotify(true);
        }
    }

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
        parentName?: string
    ) {
        if (folders.name) {
            const newFolderGoogle = {
                mimeType: 'application/vnd.google-apps.folder',
                name: folders.name,
                parents: [id],
            };
            const res = await googleMiddleware.uploadNewFolderGoogleDrive(
                GoogleDispatch,
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
        }
    }

    async function handleFolder(folder: any) {
        if (folder.target.files?.length) {
            setFormDataGoogle([]);
            let id = 'root';
            const pathName = location.pathname;
            if (
                pathName.includes('workspace-drive') &&
                WorkspaceDetailInformation.drive_default_path
            ) {
                id = WorkspaceDetailInformation.drive_default_path;
            } else if (param.folderId) {
                id = param.folderId;
            }
            // setUploadAction(UPLOAD_FOLDER);
            googleMiddleware.actionUpload(GoogleDispatch, UPLOAD_FOLDER);
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

                leftMenuMiddleware.setFolderName(
                    leftMenuDispatch,
                    folderName[0]
                );
                if (glob?.children.length) {
                    await glob.children.map((d: any) => {
                        uploadFolder(d, id, acceptedFiles);
                    });
                }
            }
        }
    }

    function handleCheckGoogleConnect(item: any) {
        if (checkGoogleAuth) {
            item.click();
        } else if (!checkGoogleAuth) {
            setIsNotify(true);
        }
    }
    function handleFunction(item: string) {
        switch (item) {
            case 'createFolder':
                handleCreateFolder();
                break;
            case 'uploadFolder':
                handleCheckGoogleConnect(folder.current);
                break;
            case 'uploadFile':
                handleCheckGoogleConnect(file.current);
                break;

            default:
                break;
        }
    }
    return (
        <>
            <div>
                <input
                    ref={file}
                    type="file"
                    onChange={(e) => handleFileInput(e)}
                    className="hidden"
                    multiple
                />
                <input
                    ref={folder}
                    type="file"
                    onChange={(e) => handleFolder(e)}
                    className="hidden"
                    webkitdirectory=""
                    mozdirectory=""
                    directory=""
                    multiple
                />
                {bar && (
                    <>
                        <div
                            className="flex item-center  px-ooolab_p_4 cursor-pointer mt-ooolab_m_4 mb-ooolab_m_4"
                            onClick={() => setSelectedMenu(-1)}
                        >
                            <div className="mr-ooolab_m_1">
                                <svg
                                    className="w-ooolab_w_4 h-ooolab_h_4"
                                    fill="none"
                                >
                                    <path
                                        d="M8.99935 0.666016C13.5993 0.666016 17.3327 4.39935 17.3327 8.99935C17.3327 13.5993 13.5993 17.3327 8.99935 17.3327C4.39935 17.3327 0.666016 13.5993 0.666016 8.99935C0.666016 4.39935 4.39935 0.666016 8.99935 0.666016ZM8.99935 15.666C12.6827 15.666 15.666 12.6827 15.666 8.99935C15.666 5.31602 12.6827 2.33268 8.99935 2.33268C5.31602 2.33268 2.33268 5.31602 2.33268 8.99935C2.33268 12.6827 5.31602 15.666 8.99935 15.666ZM8.99935 8.16602H12.3327V9.83268H8.99935V12.3327L5.66602 8.99935L8.99935 5.66602V8.16602Z"
                                        fill="#2E3A59"
                                    />
                                </svg>
                            </div>
                            <div className=" text-ooolab_dark_1 ">
                                <p className="text-ooolab_10px font-semibold">
                                    {translator(
                                        'DASHBOARD.SIDEBAR.BACK_TO_MAIN'
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="border  bg-ooolab_gray_10 w-full"></div>
                        <div className="pl-ooolab_p_4 font-semibold text-ooolab_xs text-ooolab_dark_1 mt-ooolab_m_4 mb-ooolab_m_1">
                            {bar.title}
                        </div>
                        <nav
                            className="flex-1 px-ooolab_p_1_half space-y-1 bg-white"
                            aria-label="Sidebar"
                        >
                            {bar.tab.map((item) =>
                                !item.subtabs ? (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={classNames(
                                            item.current
                                                ? 'bg-ooolab_gray_11 text-ooolab_dark_1'
                                                : 'bg-white text-ooolab_dark_2 hover:bg-ooolab_gray_11 hover:text-ooolab_dark_1',
                                            'group w-full flex items-center pr-2 py-2 text-sm rounded-md text-ooolab_xs font-semibold '
                                        )}
                                        onClick={() => (item.current = true)}
                                    >
                                        <ChevronRightIcon className="ml-ooolab_m_3 mr-ooolab_m_3 flex-shrink-0 h-ooolab_h_3_i w-ooolab_w_3_i transform transition-colors ease-in-out duration-150" />
                                        <span>{item.name}</span>
                                    </Link>
                                ) : (
                                    <Disclosure
                                        as="div"
                                        key={item.name}
                                        className="space-y-1"
                                    >
                                        {({ open }) => (
                                            <>
                                                <Disclosure.Button
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-ooolab_gray_11 text-ooolab_dark_1'
                                                            : 'bg-white text-ooolab_dark_2 hover:bg-ooolab_gray_11 hover:text-ooolab_dark_1',
                                                        'group w-full flex items-center pr-ooolab_p_2 py-ooolab_p_2 text-left text-ooolab_xs font-semibold focus:outline-none  focus:bg-ooolab_gray_11 focus:text-ooolab_dark_1'
                                                    )}
                                                >
                                                    {/* <svg
                                                        className={classNames(
                                                            open &&
                                                                'rotate-90  ',

                                                            'text-center ml-ooolab_m_3 mr-ooolab_m_3 flex-shrink-0 h-ooolab_h_3_i w-ooolab_w_3_i transform transition-colors ease-in-out duration-150'
                                                        )}
                                                        viewBox="0 0 20 20"
                                                        aria-hidden="true"
                                                    ></svg> */}
                                                    <ChevronRightIcon
                                                        className={classNames(
                                                            open &&
                                                                'rotate-90  ',

                                                            'text-center ml-ooolab_m_3 mr-ooolab_m_3 flex-shrink-0 h-ooolab_h_3_i w-ooolab_w_3_i transform transition-colors ease-in-out duration-150'
                                                        )}
                                                    />
                                                    {item.name}
                                                </Disclosure.Button>
                                                <Disclosure.Panel className="space-y-1 ">
                                                    {item.subtabs.map(
                                                        (subItem) => (
                                                            <div
                                                                key={
                                                                    subItem.name
                                                                }
                                                                onClick={() =>
                                                                    subItem.href
                                                                        ? history.push(
                                                                              subItem.href
                                                                          )
                                                                        : handleFunction(
                                                                              subItem.onFetch
                                                                          )
                                                                }
                                                                className="group w-full flex items-center pl-ooolab_p_10 pr-ooolab_p_2 cursor-pointer py-ooolab_p_2 text-ooolab_10px font-medium text-ooolab_dark_2  hover:text-ooolab_dark_1 hover:bg-ooolab_gray_11"
                                                            >
                                                                {subItem.name}
                                                            </div>
                                                        )
                                                    )}
                                                </Disclosure.Panel>
                                            </>
                                        )}
                                    </Disclosure>
                                )
                            )}
                        </nav>
                    </>
                )}
                {isCreateFolder && (
                    <CreateFolder
                        isCreateFolder={isCreateFolder}
                        setIsCreateFolder={setIsCreateFolder}
                    />
                )}
                {isNotify && (
                    <Notification
                        isNotify={isNotify}
                        setIsNotify={setIsNotify}
                    />
                )}
            </div>
        </>
    );
};

export default SubMenuNavigation;
