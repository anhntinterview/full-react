import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';

// CONTEXT
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';

// MIDDLEWARE

// ASSETs
import MemberRender from './components/MemberRender';
import {
    handleUpdateMember,
    useGetListMembers,
    useGetDrivePermission,
} from './WorkspaceListMembersFN';
import { useEffect } from 'react';

type WorkspaceListMembersProps = {
    onClose: () => void;
    token: string | undefined;
};

type UpdateMemberParamType = {
    workspaceId: string;
    memberId: string;
    body: {
        role: string;
        status: string;
        permissionId?: string;
        email?: string;
    };
};

const WorkspaceListMembers: React.FC<WorkspaceListMembersProps> = ({
    onClose,
}) => {
    const { getWorkspaceDetailState } = React.useContext(GetWorkspaceContext);
    const cancelButtonRef = useRef(null);

    const param: { id: string } = useParams();

    const { role, isCreator, workspaceDriveId } = getWorkspaceDetailState;

    const [listMembers, getListMembers] = useGetListMembers();
    const [listPermissions, getListPermissions] = useGetDrivePermission();
    const onClickMember = async (props: UpdateMemberParamType) => {
        const { body, memberId, workspaceId } = props;
        handleUpdateMember(workspaceId, memberId, body).then((res: boolean) => {
            if (res) {
                setTimeout(() => getListMembers(workspaceId), 1000);
            }
        });
    };

    useEffect(() => {
        getListMembers(param.id);
    }, []);

    useEffect(() => {
        getListPermissions(workspaceDriveId);
    }, [listMembers]);

    return (
        <>
            <div className="bg-ooolab_gray_0 w-full h-ooolab_h_12 flex items-center justify-between px-ooolab_p_4 text-sm">
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5  mr-ooolab_m_2 text-ooolab_gray_1 cursor-pointer"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        onClick={() => onClose()}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                    Members
                </div>
                <button className="border bg-white border-blue-400 rounded-md h-ooolab_h_5 text-sm min-h-button flex justify-center items-center py-4 px-ooolab_p_6">
                    Invite People
                </button>
            </div>
            {/* list member */}
            <div className="px-ooolab_p_4 pt-ooolab_p_3 w-full max-h-full ">
                <p className="text-sm flex">
                    {listMembers && listMembers.length} members
                    {/* {loading && (
                        <svg
                            className="animate-spin ml-1 mr-3 h-5 w-5 text-black"
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
                    )} */}
                </p>
                {listMembers &&
                    listMembers.map((i) => {
                        const hasPermissionId = listPermissions.find(
                            (p) => p.emailAddress === i.email
                        );
                        return (
                            <MemberRender
                                key={i.id}
                                isCreator={isCreator}
                                userRole={role}
                                memberData={i}
                                workspaceId={param.id}
                                workspaceDriveId={workspaceDriveId}
                                onClickUpdate={onClickMember}
                                permissionId={hasPermissionId?.id || ''}
                            />
                        );
                    })}
            </div>
        </>
    );
};

export default WorkspaceListMembers;
