import React, { useRef, useState } from 'react';
import { WorkspaceMember } from 'types/GetListOfWorkspace.type';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import userAvatar from 'assets/SVG/user_avatar.svg';

import { ExclamationIcon, XIcon } from '@heroicons/react/solid';

type MemberRenderType = {
    memberData: WorkspaceMember;
    isCreator: boolean | undefined;
    workspaceId: string;
    userRole: string;
    onClickUpdate: (param: UpdateMemberParamType) => void;
    permissionId: string;
    workspaceDriveId: string;
};

type UpdateMemberParamType = {
    workspaceId: string;
    memberId: string;
    body: {
        role: string;
        status: string;
        permissionId?: string;
        workspaceDriveId?: string;
        email?: string;
    };
};

const MemberRender: React.FC<MemberRenderType> = (props) => {
    const {
        memberData,
        isCreator,
        workspaceId,
        userRole,
        onClickUpdate,
        permissionId,
        workspaceDriveId,
    } = props;
    const {
        membership: { status, role },
    } = memberData;
    const userLocal = getLocalStorageAuthData();
    const [isHover, setIsHover] = useState<boolean>(false);
    const [showToolTip, setShowToolTip] = useState<boolean>(false);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    return (
        <>
            <div
                className="flex items-center py-ooolab_p_3 mt-ooolab_m_3 relative z-50"
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
            >
                <img
                    src={memberData.avatar_url || userAvatar}
                    alt=""
                    className={`w-10 h-10 mr-ooolab_m_4 rounded-full ${
                        status === 'deactivate' && 'opacity-40'
                    }`}
                />
                <div
                    className={`flex flex-col text-sm ${
                        status === 'deactivate' && 'opacity-40'
                    }`}
                >
                    <p className="flex items-center">
                        {memberData.name}{' '}
                        {!permissionId && (
                            <div
                                onMouseEnter={() => setShowToolTip(true)}
                                onMouseLeave={() => setShowToolTip(false)}
                                className="relative"
                            >
                                <ExclamationIcon className="w-4 h-4 text-ooolab_warn" />
                                <span
                                    className={`${
                                        showToolTip ? null : 'hidden'
                                    } text-xs bg-white absolute -top-4 -right-14 w-36 text-center shadow-ooolab_box_shadow_2 rounded`}
                                >
                                    Not in Workspace drive
                                </span>
                            </div>
                        )}
                    </p>
                    <p className="text-ooolab_gray_0 capitalize">
                        {(status.toLocaleLowerCase() !== 'deactivate' &&
                            role) ||
                            null}

                        {status.toLocaleLowerCase() === 'invite' && (
                            <span className="text-ooolab_warn ml-ooolab_m_1">
                                &bull;Pending
                            </span>
                        )}
                        {status.toLocaleLowerCase() === 'deactivate' && (
                            <span className="text-black ml-ooolab_m_1">
                                Deactivate
                            </span>
                        )}
                    </p>
                </div>
                {isHover && status !== 'invite' && (
                    <button
                        onClick={() => {
                            if (status === 'active') {
                                setIsUpdate(true);
                            } else if (status === 'deactivate') {
                                onClickUpdate({
                                    workspaceId,
                                    memberId: `${memberData.id}`,
                                    body: {
                                        role: memberData.membership.role,
                                        status: memberData.membership.status,
                                        email: memberData.email,
                                        workspaceDriveId,
                                    },
                                });
                            }
                        }}
                        className={`z-40 border-white border-2 border-opacity-100 py-ooolab_p_1 px-ooolab_p_3 shadow-ooolab_box_shadow_2 rounded absolute right-0 focus:outline-none ${
                            (isCreator &&
                                userLocal.email.toLocaleLowerCase() !==
                                    memberData.email.toLocaleLowerCase()) ||
                            (userRole === 'admin' &&
                                userLocal.email.toLocaleLowerCase() !==
                                    memberData.email.toLocaleLowerCase())
                                ? 'block'
                                : 'hidden'
                        }`}
                    >
                        {(memberData.membership.status === 'active' ||
                            memberData.membership.status === 'invite') &&
                            'Deactivate'}
                        {memberData.membership.status === 'deactivate' && (
                            <span className="text-green-600">Activate</span>
                        )}
                    </button>
                )}
                <div
                    className={`bg-white rounded w-96 shadow-ooolab_box_shadow_2 h-ooolab_h_28 absolute -left-96 pt-ooolab_p_5 pb-ooolab_p_3 px-ooolab_p_5 items-start ${
                        !isUpdate ? 'hidden' : ''
                    }`}
                >
                    <div className="flex align-top items-start">
                        <ExclamationIcon className="text-ooolab_warn w-10" />
                        <p className="text-sm pl-ooolab_p_1">
                            {`You are removing ${memberData.name} from the workspace and accessing on workspace drive.`}
                        </p>
                        <XIcon
                            onClick={() => setIsUpdate(false)}
                            className="text-ooolab_gray_3 w-8"
                        />
                    </div>
                    <div className="flex flex-row-reverse mt-5">
                        <button
                            onClick={() => {
                                onClickUpdate({
                                    workspaceId,
                                    memberId: `${memberData.id}`,
                                    body: {
                                        role: memberData.membership.role,
                                        status: memberData.membership.status,
                                        permissionId,
                                        workspaceDriveId,
                                    },
                                });
                                setTimeout(() => setIsUpdate(false), 500);
                            }}
                            className="text-ooolab_blue_0 ml-ooolab_m_3 focus:outline-none"
                        >
                            Confirm
                        </button>
                        <button onClick={() => setIsUpdate(false)}>
                            Go back
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MemberRender;
