import * as React from 'react';
// PACKAGE
import { toInteger } from 'lodash';
import { useParams, useLocation } from 'react-router-dom';
import { ViewGridIcon } from '@heroicons/react/solid';
import { ViewListIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// COMPONENT
import LessonCard from './LessonCard';
import WorkspaceFolderTable from '../WorkspaceFolder/WorkspaceFolderTable';

// CONTEXT
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';
import { GoogleAPIAndServicesServerSideContext } from 'contexts/Google/GoogleAPIAndServicesContext';

// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';
import WorkspaceTitleViewFolder from '../WorkspaceTitleViewFolder';
import googleMiddleware from 'middleware/google.middleware';
import ContextMenu from '../../CommonMenu';

// TYPES
import {
    AuthentiacteWithDriveOAuth2ArgsType,
    GetDriveCredentialOfWorkspaceOAuth2ArgsType,
    GoogleFiles,
    RedirectUrlPage,
} from 'types/GoogleType';

// CONST
import { MENU_ITEMS } from 'constant/menu.const';
import {
    ERROR_LOGOUT_MSG,
    GOOGLE_SERVER_SIDE,
} from 'constant/api.const';
// UTILS
import { getAttrLocalStorageAuthData } from 'utils/handleLocalStorage';
import { LeftMenuContext } from 'contexts/LeftMenu/LeftMenuContext';
import CreateFolder from '../../GoogleDriver/CreateFolder';
import { GOOGLE } from 'constant/google.const';

// LOGIC
import {
    WorkspaceHomeContentProps,
    LocationState,
    handleClickFolder,
    handleChangeView,
    notify,
    oauth2Submit,
    handleClickBreadCrumb,
} from './WorkspaceHomeContentFn';

const WorkspaceHomeContent: React.FC<WorkspaceHomeContentProps> = () => {
    const location = useLocation<LocationState>();

    // *** CAN BE REVERTED IN FUTURE: AUTHENTICATE SERVER SIDE
    // const [
    //     redirectUrlWorkspace,
    //     setRedirectUrlWorkspace,
    // ] = React.useState<RedirectUrlWorkspace>();
    const [errorMsg, setErrorMsg] = React.useState<string>();
    const access_token = getAttrLocalStorageAuthData('access_token') as string;
    const [workspaceId, setWorkspaceId] = React.useState<string>();
    const [breadCrumb, setBreadCrumb] = React.useState<
        { name: string; id: string }[]
    >([{ name: 'Home', id: 'home' }]);
    const { handleSubmit } = useForm();

    const checkGoogleAuth = localStorage.getItem('google_auth');
    // const checkGoogleAuth = localStorage.getItem('google_oauth_token');
    const param: { id: string } = useParams();
    const { dispatch } = React.useContext(GetWorkspaceContext);
    const [view, setView] = React.useState<boolean>(true);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [currentListFiles, setCurrentListFiles] = React.useState<
        GoogleFiles[]
    >([]);

    // *** CAN BE REVERTED IN FUTURE: AUTHENTICATE SERVER SIDE
    // const {
    //     dispatch: googleServerSideDispatch,
    //     googleServerSideState: {
    //         getDriveAuthentiacteUrlResult,
    //         getDriveAuthentiacteUrlResponseError,
    //         getDriveAuthentiacteUrlResponseValidateError,

    //         authentiacteWithDriveResult,
    //         authentiacteWithDriveResponseError,
    //         authentiacteWithDriveResponseValidateError,

    //         getDriveCredentialOfWorkspaceResult,
    //         getDriveCredentialOfWorkspaceResponseError,
    //         getDriveCredentialOfWorkspaceResponseValidateError,
    //     },
    //     googleServerSideState,
    // } = React.useContext(GoogleAPIAndServicesServerSideContext);
    const { dispatch: googleDispatch, googleState } = React.useContext(
        GoogleAPIAndServicesContext
    );
    const { dispatch: commonDispatch, leftMenuState } = React.useContext(
        LeftMenuContext
    );

    const {
        driveGoogleGetListResult,
        driveGoogleFolderResult,
        isLoadingList,
        updateStatus,
        target,
        destination,
        action: actionUpdate,
        errors,
    } = googleState;
    React.useEffect(() => {
        const { files: listFiles } = driveGoogleGetListResult;
        if (listFiles) {
            setCurrentListFiles(listFiles);
        }
    }, [driveGoogleGetListResult]);

    React.useEffect(() => {
        if (driveGoogleFolderResult) {
            // googleMiddleware.getListGoogleDrive(googleDispatch, {});
            const newFolder: GoogleFiles = driveGoogleFolderResult;
            setCurrentListFiles((prevState) => [newFolder, ...prevState]);
            // setCurrentListFiles((prevState) => {
            //     if (prevState) {
            //         prevState.unshift(newFolder);
            //     }
            //     return prevState;
            // });
        }
    }, [driveGoogleFolderResult]);

    // React.useEffect(() => {
    //     if (leftMenuState.data) {
    //         console.log(leftMenuState.data);
    //         Array.from(leftMenuState.data).forEach((d) => {
    //             const fsize = d.size;
    //             const file = Math.round(fsize / 1024);
    //             const fileMetaData = {
    //                 name: d.name,
    //                 mineType: d.type,
    //             };
    //             googleMiddleware.uploadFileGoogleDrive(
    //                 googleDispatch,
    //                 fileMetaData,
    //             );
    //             if (file >= 5120) {
    //                 alert('File too Big, please select a file less than 5mb');
    //             } else {
    //                 alert('File ');
    //             }
    //             return file;
    //         });
    //     }
    // }, [leftMenuState.data]);

    React.useEffect(() => {
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
            );
            const q =
                breadCrumb.length === 1
                    ? "'root' in parents and trashed = false"
                    : `'${
                          breadCrumb[breadCrumb.length - 1].id
                      }' in parents and trashed = false`;
            googleMiddleware.getListGoogleDrive(googleDispatch, {
                q,
                fields: '*',
                orderBy: 'folder,modifiedTime desc',
            });
        }
    }, [updateStatus]);

    React.useEffect(() => {
        // *** CAN BE REVERTED IN FUTURE: AUTHENTICATE SERVER SIDE
        // // Authenticate With Drive
        // if (location.state && location.state.to.redirectUrlWorkspace) {
        //     setRedirectUrlWorkspace(location.state.to.redirectUrlWorkspace);
        // }
        // Get id
        const { id } = param;
        setWorkspaceId(id);
        if (id) {
            const convertId = toInteger(id);
            workspaceMiddleware.setWorkspaceId(dispatch, convertId);
        }
        googleMiddleware.getListGoogleDrive(googleDispatch, {
            q: "'root' in parents",
            fields: '*',
            orderBy: 'folder,modifiedTime desc',
        });
    }, []);

    // *** CAN BE REVERTED IN FUTURE: AUTHENTICATE SERVER SIDE
    // function onSubmit() {
    //     return () => {
    //         if (access_token && workspaceId) {
    //             const args: GetDriveCredentialOfWorkspaceOAuth2ArgsType = {
    //                 access_token,
    //                 workspace_id: workspaceId,
    //             };
    //             googleServerSideMiddleware.getDriveAuthenticateUrlOAuth2(
    //                 googleServerSideDispatch,
    //                 args
    //             );
    //         }
    //     };
    // }

    // *** CAN BE REVERTED IN FUTURE: AUTHENTICATE SERVER SIDE
    // React.useEffect(() => {
    //     if (getDriveAuthentiacteUrlResult && workspaceId) {
    //         const redirectUrlWorkspaceId: RedirectUrlWorkspace = {
    //             state: getDriveAuthentiacteUrlResult.state,
    //             workspaceId,
    //             workspaceUrl: `/workspace/${workspaceId}`,
    //             code: undefined,
    //         };
    //         localStorage.setItem(
    //             GOOGLE_SERVER_SIDE.LOCAL_STORAGE
    //                 .GOOGLE_REDIRECT_URL_WORKSPACE_ID,
    //             JSON.stringify(redirectUrlWorkspaceId)
    //         );
    //         window.location.assign(
    //             getDriveAuthentiacteUrlResult.authentication_url
    //         );
    //     }
    //     if (getDriveAuthentiacteUrlResponseError) {
    //         setErrorMsg(getDriveAuthentiacteUrlResponseError.error.description);
    //     }
    //     if (getDriveAuthentiacteUrlResponseValidateError) {
    //         setErrorMsg(
    //             getDriveAuthentiacteUrlResponseValidateError.validation_error
    //                 .body_params[0].msg
    //         );
    //     }
    // }, [
    //     getDriveAuthentiacteUrlResult ||
    //         getDriveAuthentiacteUrlResponseError ||
    //         getDriveAuthentiacteUrlResponseValidateError,
    // ]);

    // *** CAN BE REVERTED IN FUTURE: AUTHENTICATE SERVER SIDE
    // React.useEffect(() => {
    //     if (redirectUrlWorkspace) {
    //         const { state, code, workspaceId } = redirectUrlWorkspace;
    //         if (code) {
    //             const args: AuthentiacteWithDriveOAuth2ArgsType = {
    //                 access_token,
    //                 workspace_id: workspaceId,
    //                 state,
    //                 code,
    //             };
    //             googleServerSideMiddleware.authenticateWithDrivelOAuth2(
    //                 googleServerSideDispatch,
    //                 args
    //             );
    //         }
    //     }
    //     if (authentiacteWithDriveResponseError) {
    //         setErrorMsg(authentiacteWithDriveResponseError.error.description);
    //     }
    //     if (authentiacteWithDriveResponseValidateError) {
    //         setErrorMsg(
    //             authentiacteWithDriveResponseValidateError.validation_error
    //                 .body_params[0].msg
    //         );
    //     }
    // }, [
    //     redirectUrlWorkspace ||
    //         authentiacteWithDriveResponseError ||
    //         authentiacteWithDriveResponseValidateError,
    // ]);

    // *** CAN BE REVERTED IN FUTURE: AUTHENTICATE SERVER SIDE
    // React.useEffect(() => {
    //     if (authentiacteWithDriveResult === 204) {
    //         if (redirectUrlWorkspace) {
    //             const { workspaceId } = redirectUrlWorkspace;
    //             const args: GetDriveCredentialOfWorkspaceOAuth2ArgsType = {
    //                 access_token,
    //                 workspace_id: workspaceId,
    //             };
    //             googleServerSideMiddleware.getDriveCredentialsOfWorkspaceOAuth2(
    //                 googleServerSideDispatch,
    //                 args
    //             );
    //         }
    //         if (getDriveCredentialOfWorkspaceResponseError) {
    //             setErrorMsg(
    //                 getDriveCredentialOfWorkspaceResponseError.error.description
    //             );
    //         }
    //         if (getDriveCredentialOfWorkspaceResponseValidateError) {
    //             setErrorMsg(
    //                 getDriveCredentialOfWorkspaceResponseValidateError
    //                     .validation_error.body_params[0].msg
    //             );
    //         }
    //     }
    // }, [
    //     authentiacteWithDriveResult ||
    //         getDriveCredentialOfWorkspaceResponseError ||
    //         getDriveCredentialOfWorkspaceResponseValidateError,
    // ]);

    // // CAN BE REVERTED IN FUTURE: AUTHENTICATE SERVER SIDE
    // React.useEffect(() => {
    // // *** CAN BE REVERTED IN FUTURE: AUTHENTICATE SERVER SIDE
    // if (getDriveCredentialOfWorkspaceResult) {
    //     localStorage.setItem(
    //         GOOGLE_SERVER_SIDE.LOCAL_STORAGE.GOOGLE_OAUTH_TOKEN,
    //         JSON.stringify(getDriveCredentialOfWorkspaceResult)
    //     );
    // }
    // // *** CAN BE REVERTED IN FUTURE: AUTHENTICATE SERVER SIDE
    // console.log('run every time');
    // googleMiddleware.getListGoogleDrive(googleDispatch, {
    //     q: "'root' in parents",
    //     fields: '*',
    //     orderBy: 'folder,modifiedTime desc',
    // });
    // }, [getDriveCredentialOfWorkspaceResult]);

    // // CAN BE REVERTED IN FUTURE: AUTHENTICATE SERVER SIDE
    // React.useEffect(() => {
    //     if (checkTokenGoogle) {
    //         if (access_token && workspaceId) {
    //             const args: GetDriveCredentialOfWorkspaceOAuth2ArgsType = {
    //                 access_token,
    //                 workspace_id: workspaceId,
    //             };
    //             googleServerSideMiddleware.getDriveAuthenticateUrlOAuth2(
    //                 googleServerSideDispatch,
    //                 args
    //             );
    //         }
    //         if (!getDriveAuthentiacteUrlResponseError || !getDriveAuthentiacteUrlResponseValidateError) {
    //             setCheckTokenGoogle(false);
    //         }
    //     }
    // }, [checkTokenGoogle]);

    return (
        <>
            <ToastContainer />
            {!checkGoogleAuth && (
                <div className="w-full min-h-7 pl-2 bg-red-600 text-white">
                    {errorMsg ? (
                        <span className="text-white">{errorMsg}</span>
                    ) : (
                        <p>
                            Your workspace is not connected to any drive yet,
                            click button "
                            <span className="font-bold">
                                Connect to Google Drive
                            </span>
                            " to connect.
                        </p>
                    )}
                    <form onSubmit={handleSubmit(oauth2Submit(param))}>
                        <button
                            type="submit"
                            className="bg-red-600 text-white py-2 px-4 mt-2 mb-2 border-white border rounded-md"
                        >
                            Connect{' '}
                        </button>
                    </form>
                </div>
            )}
            <div
                className="px-ooolab_p_16 pt-ooolab_p_5 w-5/6 h-ooolab_h_user_detail"
                ref={containerRef}
            >
                <p className="text-ooolab_2xl font-normal mb-ooolab_m_8">
                    Home
                </p>
                <p className="text-ooolab_gray_0 text-ooolab_xs mb-ooolab_m_4">
                    Lesson quick access
                </p>
                <div className="grid gap-10 grid-cols-4 mb-ooolab_m_10">
                    <LessonCard />
                    <LessonCard />
                    <LessonCard />
                    <LessonCard />
                </div>
                <div className="flex text-black">
                    {(breadCrumb.length &&
                        breadCrumb.map((i, idx) => (
                            <p
                                className={`${idx > 0 && 'ml-ooolab_m_2'} ${
                                    idx === breadCrumb.length - 1
                                        ? 'text-black font-semibold'
                                        : 'hover:text-ooolab_blue_0 font-thin'
                                } cursor-pointer `}
                                key={i.id}
                                onClick={handleClickBreadCrumb(
                                    idx === breadCrumb.length - 1 ? '' : i.id,
                                    googleDispatch,
                                    setBreadCrumb,
                                    breadCrumb
                                )}
                            >
                                {`${i.name} `}{' '}
                                <span className="font-semibold">/</span>
                            </p>
                        ))) ||
                        null}
                </div>
                <div className="flex w-full">
                    <p className="w-4/5 text-ooolab_xs font-semibold mb-ooolab_m_4 flex">
                        {isLoadingList && (
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
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        )}
                    </p>
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

                {/* {view ? (
                    <>
                        <WorkspaceFolderTable
                            onClickFolder={handleClickFolder}
                            data={currentListFiles || []}
                            setBreadCrumb={setBreadCrumb}
                            breadCrumb={breadCrumb}
                            googleDispatch={googleDispatch}
                        />
                    </>
                ) : (
                    <>
                        <WorkspaceTitleViewFolder
                            onClickFolder={handleClickFolder}
                            data={currentListFiles || []}
                            setBreadCrumb={setBreadCrumb}
                            breadCrumb={breadCrumb}
                            googleDispatch={googleDispatch}
                        />
                    </>
                )}
                <ContextMenu
                    containerRef={containerRef}
                    menuItems={MENU_ITEMS}
                />
                {isCreateFolder && (
                    <CreateFolder
                        isCreateFolder={isCreateFolder}
                        setIsCreateFolder={setIsCreateFolder}
                        breadCrumb={breadCrumb}
                    />
                )} */}
            </div>
        </>
    );
};

export default WorkspaceHomeContent;
