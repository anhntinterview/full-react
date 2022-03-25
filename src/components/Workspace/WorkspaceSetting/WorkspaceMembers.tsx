import {
    FC,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { PlusIcon, SearchIcon } from '@heroicons/react/outline';
import { useLocation, useParams } from 'react-router';
import { debounce, toInteger } from 'lodash';

import { GoogleAPIAndServicesContext } from 'contexts/Google/GoogleAPIAndServicesContext';
import googleMiddleware from 'middleware/google.middleware';
import workspaceService from 'services/workspace.service';
import { WorkspaceMember } from 'types/GetListOfWorkspace.type';
import { GoogleFileUser } from 'types/GoogleType';

import Tooltip from 'components/Tooltip';
import {
    handleCreatePermissionWorkspaceDrive,
    handleRemoveWorkspaceDrive,
} from '../WorkspaceInformation/WorkspaceListMembersFN';
import ModalInvite from './InviteModal';
import MemberRender from './MemberRender';
import Notification from 'components/Notification';
import {
    getGoogleAuthLocal,
    getLocalStorageAuthData,
} from 'utils/handleLocalStorage';
import WorkspaceNotification from './WorkspaceSettingNotification';
import { oauth2Submit } from 'components/MasterPage/LeftNavigation/LeftMenuFN';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';
interface WorkspaceMembersProps {
    workspaceDrivePath: string;
    data: WorkspaceMember[];
    workspaceDriveId: string;
    searchMember: (e: string) => void;
    getMembers: Function;
    canLoadMore: boolean;
    currentUser: {
        id: number;
        status: string;
        is_creator: boolean;
        role: string;
        last_visited: string | null;
        user_id: number;
    };
    listSharedWorkspaceDrive: GoogleFileUser[];
}

const WorkspaceMembers: FC<WorkspaceMembersProps> = ({
    workspaceDrivePath,
    data,
    workspaceDriveId,
    searchMember,
    getMembers,
    canLoadMore,
    currentUser,
    listSharedWorkspaceDrive,
}) => {
    const { t: translator } = useTranslation();
    const [hasGoogleTokenErr, sethasGoogleTokenErr] = useState(false);
    const [hasWorkspaceDriveErr, setHasWorkspaceDriveErr] = useState(false);

    const { dispatch: GoogleDispatch } = useContext(
        GoogleAPIAndServicesContext
    );
    const [searchText, setSearchText] = useState('');
    const [modalInvite, setModalInvite] = useState(false);
    const params: { id: string } = useParams();
    const listEmail = useMemo(
        () => listSharedWorkspaceDrive.map((i) => i?.emailAddress || ''),
        [listSharedWorkspaceDrive]
    );
    const debounceInput = useCallback(
        debounce(
            (
                nextValue: string,
                asyncFunc: (e: string) => void,
                extra?: (p: string) => void
            ) => {
                asyncFunc(nextValue);
                if (extra) {
                    extra(nextValue);
                }
            },
            800
        ),
        []
    );

    const handleRemoveMember = async (id: string, role: string) => {
        workspaceService
            .updateWorkspaceMembers(params.id, id, {
                role,
                status: 'deactivate',
            })
            .then((res) => {
                if (res) {
                    setTimeout(() => getMembers(), 800);
                }
            });
    };

    const handleChangeRole = async (id: string, role: string) => {
        workspaceService
            .updateWorkspaceMembers(params.id, id, {
                role,
                status: 'active',
            })
            .then((res) => {
                if (res) {
                    setTimeout(() => getMembers(), 1000);
                }
            });
    };

    const handleAddMemberToWorkspaceDrive = async (email: string) => {
        const googleAuth = getGoogleAuthLocal();
        if (!googleAuth) {
            sethasGoogleTokenErr(true);
            return;
        }
        return handleCreatePermissionWorkspaceDrive(
            workspaceDrivePath,
            {
                fields: '*',
            },
            email
        );
    };

    const handleRemoveMemberWorkspaceDrive = async (
        workspaceDriveId: string,
        permissionId: string
    ) => {
        const googleAuth = getGoogleAuthLocal();

        if (!googleAuth) {
            sethasGoogleTokenErr(true);
            return;
        }
        return handleRemoveWorkspaceDrive(workspaceDriveId, permissionId);
    };

    return (
        <>
            <Notification
                isNotify={hasGoogleTokenErr}
                setIsNotify={sethasGoogleTokenErr}
            />
            <WorkspaceNotification
                isNotify={hasWorkspaceDriveErr}
                setIsNotify={setHasWorkspaceDriveErr}
                title={
                    <p className="text-ooolab_1xs px-ooolab_p_3">
                        <span className="text-red-500 font-medium">
                            {translator('WORKSPACE_MEMBER.WORKSPACE_DRIVE')}
                        </span>{' '}
                        {translator('WORKSPACE_MEMBER.NOT_FOUND')}
                    </p>
                }
            />
            <ModalInvite
                workspaceId={toInteger(params.id)}
                isOpen={modalInvite}
                onClose={() => {
                    setModalInvite(false);
                    searchMember('');
                }}
                getMembers={getMembers}
            />
            <div className="relative w-ooolab_login_3 mb-ooolab_m_8">
                <input
                    className="border border-ooolab_dark_1 rounded w-full h-ooolab_h_10 py-ooolab_p_2 pl-ooolab_p_4 pr-ooolab_p_10"
                    type="text"
                    name=""
                    placeholder={translator(
                        'DASHBOARD.WORKSPACE_SETTING.SEARCH_MEMBERS'
                    )}
                    id=""
                    onChange={(e) => {
                        debounceInput(
                            e.target.value,
                            searchMember,
                            setSearchText
                        );
                    }}
                />
                <SearchIcon className="w-ooolab_w_5 h-ooolab_h_5 absolute right-ooolab_top_10px top-ooolab_top_10px" />
            </div>
            <button
                onClick={() => setModalInvite(true)}
                className="inline-flex items-center border border-ooolab_blue_1 text-ooolab_blue_1 rounded-lg px-ooolab_p_3 py-ooolab_p_1 mb-ooolab_m_4"
            >
                <PlusIcon className="w-ooolab_w_4 h-ooolab_h_4 mr-ooolab_m_1" />
                {translator('DASHBOARD.SIDEBAR.INVITE_MEMBERS')}
            </button>
            <InfiniteScroll
                dataLength={data?.length}
                next={() => getMembers()}
                hasMore={canLoadMore}
                loader={false && <h4> {translator('LOADING')}</h4>}
                height={'calc(400*(100vw/1440))'}
                scrollableTarget="scrollableDiv"
                className="custom-style-scrollbar"
            >
                <div className="grid grid-cols-3 gap-ooolab_w_6">
                    {(data.length &&
                        data.map((i) => (
                            <MemberRender
                                currentUserId={currentUser.id}
                                hasWorkspaceDrive={!!workspaceDrivePath}
                                didSharedDrive={listEmail.includes(i.email)}
                                handleAddMemberToWorkspaceDrive={
                                    handleAddMemberToWorkspaceDrive
                                }
                                handleChangeRole={handleChangeRole}
                                handleRemoveMember={handleRemoveMember}
                                handleRemoveMemberWorkspaceDrive={(e) =>
                                    handleRemoveMemberWorkspaceDrive(
                                        workspaceDriveId,
                                        e
                                    )
                                }
                                listSharedWorkspaceDrive={
                                    listSharedWorkspaceDrive
                                }
                                member={i}
                                getMembers={() => {
                                    googleMiddleware.getFile(
                                        GoogleDispatch,
                                        workspaceDrivePath
                                    );
                                }}
                                workspaceDriveErrCB={() =>
                                    setHasWorkspaceDriveErr(true)
                                }
                                key={`member-${i.id}`}
                            />
                        ))) || (
                        <p>
                            {translator('WORKSPACE_MEMBER.NO_RESULT_FOR')}
                            <span className="font-medium">{searchText}</span>
                        </p>
                    )}
                </div>
            </InfiniteScroll>
        </>
    );
};

export default WorkspaceMembers;
