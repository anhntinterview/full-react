import React, {
    Fragment,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
    getLocalStorageAuthData,
    isLocalStorageAuth,
    removeLocalStorageAuthData,
} from 'utils/handleLocalStorage';
import { FormDataType, GoogleTypeFolder, TreeFolder } from 'types/GoogleType';
import googleMiddleware from 'middleware/google.middleware';
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';
import { UPLOAD_FILE, UPLOAD_FOLDER } from 'constant/menu.const';
import { FileUpload } from 'types/LeftMenu.type';
import leftMenuMiddleware from 'middleware/leftMenu.middleware';
import { LeftMenuContext } from 'contexts/LeftMenu/LeftMenuContext';
import Workspace from 'assets/workspace.png';
import {
    BarType,
    CreateBarMenu,
    generateAppBars,
    IBarItem,
    UploadBarMenu,
    WorkspaceBarMenu,
} from 'constant/setupBars.const';
import {
    GetListOfWorkspaceContext,
    GetWorkspaceContext,
} from 'contexts/Workspace/WorkspaceContext';
import InviteWorkspaceMemberModal from 'components/Workspace/InviteWorkspaceMemberModal';
import CreateFolder from 'components/GoogleDriver/CreateFolder';
import workspaceMiddleware from 'middleware/workspace.middleware';
import LeftBarItem from 'components/LeftBarItem';
import IconInMenu from './IconInMenu';
import CreateMenu from './CreateMenu';
import { Menu } from '@headlessui/react';
import Tooltip from 'components/Tooltip';
import { AuthContext } from 'contexts/Auth/AuthContext';
import { SET_AUTH } from 'actions/auth.action';
import googleService from 'services/google.service';
import Notification from 'components/Notification';
import {
    handleCreateMembersPermission,
    handleCreateWorkspaceDrive,
} from './LeftMenuFN';
import { handleRole } from 'components/H5P/H5PFN';
import { UploadAvatarContext } from 'contexts/User/UserContext';
import UserDetailMenu from 'components/MainNav/UserDetailMenu';
import { useTranslation } from 'react-i18next';

export interface NavigationProps {
    tabType: BarType;
}

interface IProps {
    setOpenUserDetail?: React.Dispatch<React.SetStateAction<boolean>>;
    onClickWorkspaceDetail?: (type?: string) => void;
    setAuthStorage?: React.Dispatch<React.SetStateAction<boolean>>;
    setHasWorkspaceDrive: any;
}

const LeftNavigation: React.FC<NavigationProps & IProps> = ({
    tabType,
    setOpenUserDetail,
    onClickWorkspaceDetail,
    setAuthStorage,
    setHasWorkspaceDrive,
}) => {
    const history = useHistory();
    const userInfo = getLocalStorageAuthData();
    const { access_token } = userInfo;
    const [avatar, setAvatar] = useState(userInfo.avatar_url);
    const checkGoogleAuth = localStorage.getItem('google_auth');
    const {
        dispatch: workspaceDispatch,
        getWorkspaceDetailState,
    } = React.useContext(GetWorkspaceContext);
    const param: { id: string; type?: string; folderId: string } = useParams();
    const [adminRole, setAdminRole] = useState<boolean>(false);
    const { t: translator } = useTranslation();
    const {
        members,
        isCreator,
        workspaceDriveId,
        result: WorkspaceDetailInformation,
    } = getWorkspaceDetailState;
    const {
        membership: { role },
    } = WorkspaceDetailInformation;

    // useEffect(() => {
    //     if (WorkspaceDetailInformation.id === -1) {
    //         workspaceMiddleware.getWorkspace(workspaceDispatch, {
    //             id: param.id,
    //         });
    //     }
    // }, [param.id]);
    const appBars = useMemo(
        () =>
            generateAppBars(
                param.id,
                role === 'admin' ? true : false,
                translator
            ),
        [role, param.id, translator]
    );
    const currentParentTab = useMemo(
        () => appBars.find((item: IBarItem) => item.type === tabType),
        [tabType]
    );
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
    const { uploadAvatarState, dispatch } = React.useContext(
        UploadAvatarContext
    );

    const uploadAvatarStateAvatarFinalResult =
        uploadAvatarState.avatarFinalResult;

    const [isNotify, setIsNotify] = useState<boolean>(false);

    const authCtx = useContext(AuthContext);
    const authDispatch = authCtx.dispatch;
    const logOut = () => {
        authDispatch({ type: SET_AUTH.LOGOUT });
        removeLocalStorageAuthData(history.location.pathname);
        if (setAuthStorage) {
            setAuthStorage(isLocalStorageAuth());
        }
        history.push('/login');
    };
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
    // useEffect(() => {
    //     if (typeof isCreator === 'boolean') {
    //         googleService
    //             .getListGoogleDrive({
    //                 q: isCreator
    //                     ? `appProperties has {key="id" and value="${param.id}"} and trashed = false `
    //                     : `sharedWithMe=true and appProperties has {key="id" and value="${param.id}"} and trashed = false`,
    //                 fields: '*',
    //             })
    //             .then((res) => {
    //                 if (res?.files && res.files[0]) {
    //                     setHasWorkspaceDrive(true);
    //                     const tmp = res.files[0].id;
    //                     if (tmp !== workspaceDriveId) {
    //                         workspaceMiddleware.setWorkspaceDriveId(
    //                             workspaceDispatch,
    //                             tmp
    //                         );
    //                     }
    //                 } else if (isCreator) {
    //                     handleCreateWorkspaceDrive(param.id, isCreator).then(
    //                         (res) => {
    //                             if (res) {
    //                                 workspaceMiddleware.setWorkspaceDriveId(
    //                                     workspaceDispatch,
    //                                     res?.id
    //                                 );
    //                                 handleCreateMembersPermission(
    //                                     members.items,
    //                                     res.id
    //                                 );
    //                             }
    //                         }
    //                     );
    //                 } else {
    //                     setHasWorkspaceDrive(false);
    //                 }
    //             });
    //     }
    // }, [isCreator]);
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

    const [isCreateFolder, setIsCreateFolder] = useState<boolean>(false);

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

    const getListOfWorkspaceCtx = useContext(GetListOfWorkspaceContext);
    const getListOfWorkspaceDispatch = getListOfWorkspaceCtx.dispatch;
    useEffect(() => {
        if (access_token) {
            // workspaceMiddleware.getWorkspace(dispatch, {
            //     id: param.id,
            // });
            workspaceMiddleware.getListOfWorkspace(getListOfWorkspaceDispatch, {
                access_token,
            });
        }
    }, []);

    function handleCheckGoogleConnect(item: any) {
        if (checkGoogleAuth) {
            item.click();
        } else if (!checkGoogleAuth) {
            setIsNotify(true);
        }
    }

    React.useEffect(() => {
        if (uploadAvatarStateAvatarFinalResult) {
            setAvatar(uploadAvatarStateAvatarFinalResult.avatar_url);
        }
    }, [uploadAvatarStateAvatarFinalResult]);

    return (
        <Fragment>
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
            <div className="fixed top-0 left-0 bottom-0 bg-white z-60 border-r border-ooolab_bar_color">
                <div className="flex flex-col h-full">
                    <div className="flex-1">
                        <div className="w-min m-auto mt-2 rounded-sub_tab shadow-ooolab_inset_navigation">
                            <Tooltip
                                title={`${translator(
                                    'ACCOUNT_SETTING.ACCOUNT_SETTINGS'
                                )}`}
                                mlClass="ml-0"
                                mtClass="mt-ooolab_custom_tooltip_left"
                            >
                                <UserDetailMenu
                                    setAuthStorage={setAuthStorage}
                                />
                            </Tooltip>
                            <div className="rounded-sub_tab w-ooolab_w_10 bg-white mt-4 shadow-ooolab_sub_item">
                                <Menu as="div" className="text-center pt-2">
                                    {({ open }) => (
                                        <CreateMenu
                                            open={open}
                                            items={CreateBarMenu(translator)}
                                            onItemClick={(index: number) => {
                                                switch (index) {
                                                    case 0:
                                                        history.push(
                                                            `/workspace/${param.id}/course/new`
                                                        );
                                                        break;
                                                    case 1:
                                                        history.push(
                                                            `/workspace/${param.id}/lesson/new`
                                                        );
                                                        break;
                                                    case 2:
                                                        history.push(
                                                            `/workspace/${param.id}/h5p-content/new`
                                                        );
                                                        break;
                                                    case 3:
                                                        handleCreateFolder();
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }}
                                        >
                                            <IconInMenu open={open}>
                                                <svg
                                                    className="w-ooolab_w_4_e h-ooolab_h_4_i"
                                                    viewBox="0 0 18 17"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M9.00002 1.9333C5.31812 1.9333 2.33335 4.91807 2.33335 8.59997C2.33335 12.2819 5.31812 15.2666 9.00002 15.2666C12.6819 15.2666 15.6667 12.2819 15.6667 8.59997C15.6667 4.91807 12.6819 1.9333 9.00002 1.9333ZM0.666687 8.59997C0.666687 3.99759 4.39765 0.266632 9.00002 0.266632C13.6024 0.266632 17.3334 3.99759 17.3334 8.59997C17.3334 13.2023 13.6024 16.9333 9.00002 16.9333C4.39765 16.9333 0.666687 13.2023 0.666687 8.59997ZM9.00002 4.4333C9.46026 4.4333 9.83335 4.8064 9.83335 5.26663V7.76663H12.3334C12.7936 7.76663 13.1667 8.13973 13.1667 8.59997C13.1667 9.0602 12.7936 9.4333 12.3334 9.4333H9.83335V11.9333C9.83335 12.3935 9.46026 12.7666 9.00002 12.7666C8.53978 12.7666 8.16669 12.3935 8.16669 11.9333V9.4333H5.66669C5.20645 9.4333 4.83335 9.0602 4.83335 8.59997C4.83335 8.13973 5.20645 7.76663 5.66669 7.76663H8.16669V5.26663C8.16669 4.8064 8.53978 4.4333 9.00002 4.4333Z"
                                                        fill={
                                                            open
                                                                ? 'white'
                                                                : '#0071CE'
                                                        }
                                                        className="group-hover:fill-button_bar_hover"
                                                    />
                                                </svg>
                                            </IconInMenu>
                                        </CreateMenu>
                                    )}
                                </Menu>
                                <Menu
                                    as="div"
                                    className="text-center mt-3 pb-2"
                                >
                                    {({ open }) => (
                                        <CreateMenu
                                            open={open}
                                            items={UploadBarMenu(translator)}
                                            onItemClick={(index: number) => {
                                                switch (index) {
                                                    case 0:
                                                        handleCheckGoogleConnect(
                                                            file.current
                                                        );
                                                        break;
                                                    case 1:
                                                        handleCheckGoogleConnect(
                                                            folder.current
                                                        );
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }}
                                        >
                                            <IconInMenu open={open}>
                                                <svg
                                                    className="w-ooolab_w_4_e h-ooolab_h_4"
                                                    viewBox="0 0 18 16"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M15.219 2.24642C14.6462 1.62162 13.612 1.58312 12.9225 2.27257L6.17253 9.02257C5.99796 9.19713 5.99796 9.4195 6.17253 9.59406C6.34709 9.76862 6.56945 9.76862 6.74402 9.59406L12.3273 4.01073C12.6528 3.68529 13.1804 3.68529 13.5059 4.01073C13.8313 4.33616 13.8313 4.8638 13.5059 5.18924L7.92253 10.7726C7.09709 11.598 5.81945 11.598 4.99402 10.7726C4.16858 9.94713 4.16858 8.6695 4.99402 7.84406L11.744 1.09406C13.0503 -0.212217 15.1731 -0.254723 16.4352 1.10682C17.7288 2.41383 17.7669 4.52628 16.4107 5.78442L8.50586 13.6892C6.68042 15.5147 3.81945 15.5147 1.99402 13.6892C0.16858 11.8638 0.16858 9.00283 1.99402 7.17739L8.74402 0.427392C9.06945 0.101955 9.59709 0.101955 9.92253 0.427392C10.248 0.752829 10.248 1.28047 9.92253 1.6059L3.17253 8.3559C1.99796 9.53047 1.99796 11.3362 3.17253 12.5107C4.34709 13.6853 6.15279 13.6853 7.32735 12.5107L15.244 4.59406C15.2526 4.58552 15.2613 4.57718 15.2702 4.56902C15.895 3.99628 15.9335 2.96202 15.244 2.27257C15.2355 2.26403 15.2271 2.25532 15.219 2.24642Z"
                                                        fill={
                                                            open
                                                                ? 'white'
                                                                : '#0071CE'
                                                        }
                                                        className="group-hover:fill-button_bar_hover"
                                                    />
                                                </svg>
                                            </IconInMenu>
                                        </CreateMenu>
                                    )}
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <div className="pl-ooolab_p_2 h-ooolab_h_bar">
                        {appBars.map((bar: IBarItem, index: number) => (
                            <LeftBarItem
                                key={`bar-${index}`}
                                index={index}
                                active={
                                    currentParentTab !== undefined &&
                                    currentParentTab.type === bar.type
                                }
                                {...bar}
                            />
                        ))}
                    </div>
                    <div className="flex-1 flex flex-col justify-end items-center z-70">
                        <div className="w-min mb-2 rounded-sub_tab shadow-ooolab_inset_navigation">
                            <div className="shadow-ooolab_sub_item rounded-full w-ooolab_w_10 h-ooolab_h_10 flex items-center bg-white justify-center">
                                <Menu as={Fragment}>
                                    {({ open }) => (
                                        <CreateMenu
                                            open={open}
                                            items={WorkspaceBarMenu(translator)}
                                            onItemClick={(index: number) => {
                                                switch (index) {
                                                    case 0:
                                                        setIsModal(true);
                                                        break;
                                                    case 2:
                                                        history.push('/workspace/create');
                                                        break;
                                                    case 3:
                                                        logOut();
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }}
                                            mtClass="mt-ooolab_n_custom_workspace_setting"
                                        >
                                            <IconInMenu open={open}>
                                                <div className="w-ooolab_w_4 h-ooolab_h_4 flex items-center">
                                                    <svg
                                                        className="w-ooolab_w_4 h-ooolab_h_1"
                                                        viewBox="0 0 16 4"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M8 4C9.10457 4 10 3.10457 10 2C10 0.89543 9.10457 0 8 0C6.89543 0 6 0.89543 6 2C6 3.10457 6.89543 4 8 4Z"
                                                            fill={
                                                                open
                                                                    ? 'white'
                                                                    : '#8F90A6'
                                                            }
                                                        />
                                                        <path
                                                            d="M2 4C3.10457 4 4 3.10457 4 2C4 0.89543 3.10457 0 2 0C0.89543 0 0 0.89543 0 2C0 3.10457 0.89543 4 2 4Z"
                                                            fill={
                                                                open
                                                                    ? 'white'
                                                                    : '#8F90A6'
                                                            }
                                                        />
                                                        <path
                                                            d="M14 4C15.1046 4 16 3.10457 16 2C16 0.89543 15.1046 0 14 0C12.8954 0 12 0.89543 12 2C12 3.10457 12.8954 4 14 4Z"
                                                            fill={
                                                                open
                                                                    ? 'white'
                                                                    : '#8F90A6'
                                                            }
                                                        />
                                                    </svg>
                                                </div>
                                            </IconInMenu>
                                        </CreateMenu>
                                    )}
                                </Menu>
                            </div>
                            <Tooltip title={`${translator(
                                    'DASHBOARD.WORKSPACE_SETTING.WORKSPACE_SETTINGS'
                                )}`} mlClass="ml-0">
                                <div
                                    onClick={() => {
                                        history.push(
                                            `/workspace/${param.id}/setting`
                                        );
                                    }}
                                    className="cursor-pointer shadow-ooolab_sub_item mt-4 rounded-full w-ooolab_w_10 h-ooolab_h_10 flex items-center bg-white justify-center hover:bg-ooolab_blue_1"
                                >
                                    <img
                                        src={Workspace}
                                        alt="workspace"
                                        className="w-ooolab_w_8 h-ooolab_h_8"
                                    />
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <InviteWorkspaceMemberModal
                access_token={access_token}
                isModal={isModal}
                setIsModal={setIsModal}
            />
            {isCreateFolder && (
                <CreateFolder
                    isCreateFolder={isCreateFolder}
                    setIsCreateFolder={setIsCreateFolder}
                />
            )}
            {isNotify && (
                <Notification isNotify={isNotify} setIsNotify={setIsNotify} />
            )}
        </Fragment>
    );
};

export default LeftNavigation;
