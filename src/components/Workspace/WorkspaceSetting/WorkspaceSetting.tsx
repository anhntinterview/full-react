import { Fragment, useContext, useEffect, FC, useState } from 'react';
import { Tab } from '@headlessui/react';
import { useLocation, useParams } from 'react-router';

import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';

import WorkspaceSettingForm from './WorkspaceSettingForm';
import WorkspaceMembers from './WorkspaceMembers';
import { WorkspaceMember } from 'types/GetListOfWorkspace.type';
import UpdateAvatarModal from './UpdateAvatarModal';
import WorkspaceDriveBreadCrumb from './WorkspaceDriveBreadCrumb';
import { loadPicker } from './GooglePicker';
import { oauth2Submit } from 'components/MasterPage/LeftNavigation/LeftMenuFN';

import './style.css';
import {
    getGoogleAuthLocal,
    getLocalStorageAuthData,
} from 'utils/handleLocalStorage';
import DefaultWorkspaceAva from 'assets/SVG/workspace_avatar.svg';
import googleMiddleware from 'middleware/google.middleware';
import {
    handleCreatePermissionWorkspaceDrive,
    handleRemoveWorkspaceDrive,
} from '../WorkspaceInformation/WorkspaceListMembersFN';

import { useTranslation } from 'react-i18next';

const SettingTitle: FC<{ title: string }> = ({ title }) => (
    <p className="text-ooolab_base font-medium">{title}</p>
);

const WorkspaceSetting: React.FC = ({ children }) => {
    const { t: translator } = useTranslation();
    const [listMembers, setListMembers] = useState<WorkspaceMember[]>([]);
    const [memberPage, setMemberPage] = useState(1);
    const [searchText, setSearchText] = useState('');
    const [uploadAvatarModal, setUploadAvatarModal] = useState(false);

    const localInfor = getLocalStorageAuthData();

    const googleInfo = getGoogleAuthLocal();
    const params: { id: string } = useParams();
    const locations = useLocation();
    const { dispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );

    const { dispatch: GoogleDispatch, googleState } = useContext(
        GoogleAPIAndServicesContext
    );

    const { fileDetail } = googleState;

    const {
        members,
        result: workspaceDetailInformation,
        isUpdatingWorkspace,
        updateWorkspaceStatus,
    } = getWorkspaceDetailState;

    const handleSearchMembers = (e: string) => {
        setMemberPage(1);
        setSearchText(e);

        workspaceMiddleware.getWorkspaceMembers(
            dispatch,
            {
                id: params.id,
            },
            {
                q: e,
                page: 1,
                per_page: 20,
            }
        );
    };

    const handleGetWorkspaceMember = () => {
        setMemberPage(memberPage + 1);
        workspaceMiddleware.getWorkspaceMembers(
            dispatch,
            {
                id: params.id,
            },
            {
                q: searchText,
                page: memberPage + 1,
                per_page: 20,
            }
        );
    };
    function pickerCallback(data: any) {
        if (data.action == 'picked') {
            const fileId = data.docs[0]?.id || '';
            if (fileId) {
                workspaceMiddleware.updateDetailWorkspace(dispatch, params.id, {
                    drive_default_path: fileId,
                });
            }
        }
    }

    const handleCreateWorkspaceDrivePermission = async (email: string) => {
        handleCreatePermissionWorkspaceDrive(
            workspaceDetailInformation.drive_default_path,
            {
                fields: '*',
            },
            email
        ).then((res) => {
            if (res)
                workspaceMiddleware.getWorkspace(dispatch, { id: params.id });
        });
    };

    const handleDeleteWorkspaceDrivePermission = async (
        workspaceDriveId: string,
        permissionId: string
    ) => {
        handleRemoveWorkspaceDrive(workspaceDriveId, permissionId).then(
            (res) => {
                if (res)
                    workspaceMiddleware.getWorkspace(dispatch, {
                        id: params.id,
                    });
            }
        );
    };

    useEffect(() => {
        if (params.id) {
            workspaceMiddleware.getWorkspaceMembers(
                dispatch,
                {
                    id: params.id,
                },
                {
                    per_page: 20,
                }
            );
        }
    }, [params.id]);

    useEffect(() => {
        if (memberPage == 1) {
            setListMembers(members.items);
        } else {
            setListMembers(listMembers.concat(members.items));
        }
    }, [members]);

    useEffect(() => {
        setUploadAvatarModal(false);
    }, [workspaceDetailInformation.avatar_url]);

    useEffect(() => {
        if (workspaceDetailInformation.drive_default_path) {
            googleMiddleware.getFile(
                GoogleDispatch,
                workspaceDetailInformation.drive_default_path
            );
        }
    }, [workspaceDetailInformation.drive_default_path]);

    return (
        <div className="px-ooolab_p_5 py-ooolab_p_5 mb-ooolab_m_1 w-full h-full">
            <div className="h-full shadow-ooolab_box_shadow_container px-ooolab_p_16 py-ooolab_p_8 rounded-ooolab_h5p">
                <p className="text-ooolab_dark_1 font-semibold text-ooolab_xl mb-ooolab_m_4">
                    {translator(
                        'DASHBOARD.WORKSPACE_SETTING.WORKSPACE_SETTINGS'
                    )}
                </p>
                <Tab.Group defaultIndex={0}>
                    <Tab.List className="mb-ooolab_m_8">
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${
                                        selected
                                            ? 'bg-ooolab_blue_1 text-white'
                                            : 'bg-white border border-ooolab_border_logout text-ooolab_dark_2'
                                    } px-ooolab_p_12 py-ooolab_p_1 rounded-sub_tab mr-ooolab_m_5`}
                                >
                                    {translator('SETTING')}
                                </button>
                            )}
                        </Tab>
                        <Tab as={Fragment}>
                            {({ selected }) => (
                                <button
                                    className={`${
                                        selected
                                            ? 'bg-ooolab_blue_1 text-white'
                                            : 'bg-white border border-ooolab_border_logout text-ooolab_dark_2'
                                    } px-ooolab_p_12 py-ooolab_p_1 rounded-sub_tab`}
                                >
                                    {translator('MEMBERS')} ({members.total})
                                </button>
                            )}
                        </Tab>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel className="grid gap-y-5 grid-cols-10 grid-rows-3">
                            <div className="col-span-4 row-span-2 border-b">
                                <SettingTitle title={translator('GENERAL')} />
                            </div>
                            <div className="col-span-6 row-span-2 border-b pb-ooolab_p_5">
                                <p className="text-ooolab_dark_2 mb-ooolab_m_1">
                                    {translator(
                                        'DASHBOARD.WORKSPACE_SETTING.WORKSPACE_PHOTO'
                                    )}
                                </p>
                                <div className="flex items-center mb-ooolab_m_6">
                                    <img
                                        src={
                                            workspaceDetailInformation.avatar_url ||
                                            DefaultWorkspaceAva
                                        }
                                        alt={'_avatar'}
                                        className={
                                            'block object-cover rounded-ooolab_circle bg-red-300 h-ooolab_h_20 w-ooolab_w_20'
                                        }
                                    />
                                    <div className="flex flex-col ml-ooolab_m_6 items-start">
                                        <button
                                            className="rounded-ooolab_radius_8px bg-ooolab_blue_1 px-ooolab_p_3 py-ooolab_p_1 text-ooolab_sm leading-ooolab_24px text-white font-medium focus:outline-none"
                                            onClick={() =>
                                                setUploadAvatarModal(true)
                                            }
                                        >
                                            {translator(
                                                'DASHBOARD.WORKSPACE_SETTING.CHANGE_PHOTO'
                                            )}
                                        </button>
                                        <label
                                            className={
                                                'text-ooolab_dark_2 text-ooolab_sm leading-ooolab_24px mt-ooolab_m_2'
                                            }
                                        >
                                            {translator(
                                                'DASHBOARD.WORKSPACE_SETTING.SUB_TITLE_CHANGE_PHOTO'
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <WorkspaceSettingForm
                                    data={workspaceDetailInformation}
                                    dispatch={dispatch}
                                    workspaceId={params.id}
                                    loading={isUpdatingWorkspace}
                                    status={updateWorkspaceStatus}
                                />
                            </div>
                            <div className="col-span-4 row-span-1 mt-ooolab_m_6">
                                <SettingTitle
                                    title={translator(
                                        'DASHBOARD.WORKSPACE_SETTING.FOLDER_SETTING'
                                    )}
                                />
                            </div>
                            <div className="col-span-6 row-span-1 mt-ooolab_m_6">
                                <p className="text-ooolab_dark_2 mb-ooolab_m_1 font-medium">
                                    {translator(
                                        'DASHBOARD.WORKSPACE_SETTING.TITLE_FOLDER_SETTING'
                                    )}
                                </p>
                                <p className="text-ooolab_sm font-light leading-ooolab_24px mb-ooolab_m_3">
                                    {translator(
                                        'DASHBOARD.WORKSPACE_SETTING.SUB_TITLE_FOLDER_SETTING'
                                    )}
                                </p>
                                {googleInfo ? (
                                    workspaceDetailInformation.id !== -1 &&
                                    !workspaceDetailInformation.drive_default_path ? (
                                        <p>
                                            {translator(
                                                'DASHBOARD.WORKSPACE_SETTING.NO_WORKSPACE'
                                            )}
                                            <span
                                                onClick={() => {
                                                    if (googleInfo) {
                                                        loadPicker(
                                                            googleInfo.access_token,
                                                            pickerCallback
                                                        );
                                                    }
                                                }}
                                                className="text-red-500 cursor-pointer"
                                            >
                                                {' '}
                                                {translator(
                                                    'DASHBOARD.WORKSPACE_SETTING.CLICK_HERE'
                                                )}{' '}
                                            </span>
                                            {translator(
                                                'DASHBOARD.WORKSPACE_SETTING.CREATE_WORKSPACE'
                                            )}
                                        </p>
                                    ) : (
                                        <WorkspaceDriveBreadCrumb
                                            id={
                                                workspaceDetailInformation.drive_default_path
                                            }
                                            openPicker={() =>
                                                loadPicker(
                                                    googleInfo.access_token,
                                                    pickerCallback
                                                )
                                            }
                                        />
                                    )
                                ) : (
                                    <p className="text-ooolab_dark_1 mt-ooolab_m_1">
                                        {translator(
                                            'DASHBOARD.WORKSPACE_SETTING.CLICK'
                                        )}{' '}
                                        <span
                                            onClick={() =>
                                                oauth2Submit(
                                                    {
                                                        id: params.id,
                                                        path:
                                                            locations.pathname,
                                                    },
                                                    localInfor.email
                                                )()
                                            }
                                            className="text-red-500 cursor-pointer"
                                        >
                                            {translator(
                                                'DASHBOARD.WORKSPACE_SETTING.CLICK_HERE'
                                            )}
                                        </span>{' '}
                                        {translator(
                                            'DASHBOARD.WORKSPACE_SETTING.TO_CONNECT_GOOGLE'
                                        )}
                                    </p>
                                )}
                            </div>
                        </Tab.Panel>
                        <Tab.Panel>
                            <WorkspaceMembers
                                workspaceDrivePath={
                                    workspaceDetailInformation.drive_default_path
                                }
                                searchMember={handleSearchMembers}
                                data={listMembers}
                                getMembers={handleGetWorkspaceMember}
                                canLoadMore={members.page * 10 < members.total}
                                currentUser={
                                    workspaceDetailInformation.membership
                                }
                                workspaceDriveId={`${workspaceDetailInformation.drive_default_path}`}
                                listSharedWorkspaceDrive={
                                    fileDetail?.permissions || []
                                }
                            />
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
            {(uploadAvatarModal && (
                <UpdateAvatarModal
                    access_token={localInfor.access_token}
                    titleText={translator(
                        'DASHBOARD.WORKSPACE_SETTING.UPLOAD_WORKSPACE_AVATAR'
                    )}
                    avatar_url={workspaceDetailInformation.avatar_url}
                    onCancel={() => setUploadAvatarModal(false)}
                    onUpdatedAvatar={(e) =>
                        workspaceMiddleware.updateDetailWorkspace(
                            dispatch,
                            params.id,
                            {
                                avatar: e,
                            }
                        )
                    }
                />
            )) ||
                null}
        </div>
    );
};

export default WorkspaceSetting;
