import Tooltip from 'components/Tooltip';
import {
    handleCreatePermissionWorkspaceDrive,
    handleRemoveWorkspaceDrive,
} from 'components/Workspace/WorkspaceInformation/WorkspaceListMembersFN';
import googleMiddleware from 'middleware/google.middleware';
import { FC, useState } from 'react';
import { WorkspaceMember } from 'types/GetListOfWorkspace.type';
import { GoogleFileUser } from 'types/GoogleType';
import { getGoogleAuthLocal } from 'utils/handleLocalStorage';
import MemberOptions from '../MemberOptions';
import { useTranslation } from 'react-i18next';

const RenderGoogleDriveIcon = ({
    shared = false,
    onCreatePermission,
    onDeletePermission,
    loading,
    hasConnectToDrive,
}: {
    shared?: boolean;
    onCreatePermission: () => void;
    onDeletePermission: () => void;
    loading: boolean;
    hasConnectToDrive: boolean;
}) => {
    if (shared)
        return (
            // <Tooltip
            //     title={hasConnectToDrive ? 'Workspace drive shared' : ''}
            //     mlClass="ml-0"
            //     mtClass="-mt-8"
            // >
            <svg
                onClick={onDeletePermission}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                className={`w-ooolab_w_4 h-ooolab_h_4 cursor-pointer ${loading && 'animate-pulse'
                    }`}
            >
                <path fill="#FFC107" d="M10.667 11H16L10.667 1H5.333z" />
                <path fill="#2196F3" d="M4.952 11l-2.285 4H13.5l2.5-4z" />
                <path
                    fill="#4CAF50"
                    d="M5.333 1L0 10.333 2.667 15l5.241-9.172z"
                />
            </svg>
            // </Tooltip>
        );

    return (
        <div>
            {/* <Tooltip
                    title={hasConnectToDrive ? 'Not in Workspace Drive' : ''}
                    mlClass="ml-0"
                    mtClass="-mt-8"
                > */}
            <svg
                onClick={onCreatePermission}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                className={`w-ooolab_w_4 h-ooolab_h_4 cursor-pointer ${loading && 'animate-pulse'
                    }`}
            >
                <path fill="#d2d2d2" d="M10.667 11H16L10.667 1H5.333z" />
                <path fill="#bebebe" d="M4.952 11l-2.285 4H13.5l2.5-4z" />
                <path
                    fill="#bcbcbc"
                    d="M5.333 1L0 10.333 2.667 15l5.241-9.172z"
                />
            </svg>
            {/* </Tooltip> */}
        </div>
    );
};

type MemberProps = {
    member: WorkspaceMember;
    hasWorkspaceDrive: boolean;
    didSharedDrive: boolean;
    listSharedWorkspaceDrive: GoogleFileUser[];
    currentUserId: number;
    handleAddMemberToWorkspaceDrive: (
        email: string
    ) => Promise<boolean | undefined>;
    handleRemoveMemberWorkspaceDrive: (
        permissionId: string
    ) => Promise<boolean | undefined>;
    handleRemoveMember: (id: string, role: string) => void;
    workspaceDriveErrCB: () => void;
    handleChangeRole: (id: string, role: string) => void;
    getMembers: Function;
};

const MemberRender: FC<MemberProps> = ({
    currentUserId,
    member,
    listSharedWorkspaceDrive,
    didSharedDrive,
    hasWorkspaceDrive,
    handleAddMemberToWorkspaceDrive,
    handleRemoveMemberWorkspaceDrive,
    handleRemoveMember,
    handleChangeRole,
    getMembers,
    workspaceDriveErrCB,
}) => {
    const [loading, setLoading] = useState(false);
    const googleInfo = getGoogleAuthLocal();
    const { t: translator } = useTranslation();

    return (
        <div
            key={member.id}
            className="animate-ooolab_fade_in col-span-1 px-ooolab_p_3 py-ooolab_p_2 border border-white rounded-lg flex items-center justify-between group hover:bg-ooolab_bg_logout_hover"
        >
            <div className="flex items-center w-2/3">
                <img
                    className="w-ooolab_w_10 h-ooolab_h_10 shadow-sm rounded-full mr-ooolab_m_2"
                    src={member.avatar_url}
                    alt=""
                />
                <div className="pl-ooolab_p_1_e max-w-full">
                    <p className="font-medium text-ooolab_sm">
                        {member.display_name}
                    </p>
                    <p className="w-full mb-ooolab_m_1 inline-flex flex-row text-ooolab_dark_2 text-ooolab_xs overflow-hidden overflow-ellipsis whitespace-nowrap">
                        <span className="">
                            {member.membership.role === 'admin'
                                ? translator('ADMIN')
                                : translator('MEMBERS')}
                        </span>
                        &nbsp;&bull;&nbsp;{member.email}
                    </p>
                    {!member.membership.is_creator && (
                        <RenderGoogleDriveIcon
                            hasConnectToDrive={!!googleInfo}
                            loading={loading}
                            shared={didSharedDrive}
                            onCreatePermission={() => {
                                if (hasWorkspaceDrive) {
                                    setLoading(true);
                                    handleAddMemberToWorkspaceDrive(
                                        member.email
                                    )
                                        .then((res) => {
                                            if (res)
                                                setTimeout(() =>
                                                    setLoading(false)
                                                );
                                        })
                                        .finally(() => {
                                            setTimeout(() => setLoading(false));
                                            getMembers();
                                        });
                                } else workspaceDriveErrCB();
                            }}
                            onDeletePermission={() => {
                                if (hasWorkspaceDrive) {
                                    const permissionId = listSharedWorkspaceDrive.filter(
                                        (j) =>
                                            j.type === 'user' &&
                                            j.emailAddress === member.email
                                    );
                                    if (permissionId[0].id) {
                                        setLoading(true);
                                        handleRemoveMemberWorkspaceDrive(
                                            permissionId[0].id
                                        )
                                            .then((res) => {
                                                if (res)
                                                    setTimeout(() =>
                                                        setLoading(false)
                                                    );
                                            })
                                            .finally(() => {
                                                setTimeout(() =>
                                                    setLoading(false)
                                                );
                                                getMembers();
                                            });
                                    }
                                } else workspaceDriveErrCB();
                            }}
                        />
                    )}
                </div>
            </div>

            <div className="group-hover:opacity-100 opacity-0">
                <MemberOptions
                    id={`${member.id}`}
                    role={member.membership.role}
                    onRemove={handleRemoveMember}
                    onChangeRole={handleChangeRole}
                    canRemove={
                        member.is_creator
                            ? false
                            : member.membership.user_id !== currentUserId
                    }
                />
            </div>
        </div>
    );
};

export default MemberRender;
