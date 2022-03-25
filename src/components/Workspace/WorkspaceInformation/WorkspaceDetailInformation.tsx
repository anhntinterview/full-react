import React from 'react';

// CONTEXT
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import { AuthContext } from 'contexts/Auth/AuthContext';

// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';

// ASSETS
import workspaceAvatar from 'assets/SVG/workspace_avatar_160.svg';

// LOGIC
import {
    WorkspaceDetailInformationProps,
} from './WorkspaceDetailInformationFn';

// UTILS
import { handleLogout } from "utils/handleLogout";
import {AUTH_CONST} from "constant/auth.const";

const WorkspaceDetailInformation: React.FC<WorkspaceDetailInformationProps> = ({
    setAuthStorage,
    onClose,
    token,
}) => {
    const authCtx = React.useContext(AuthContext);
    const authDispatch = authCtx.dispatch;
    const { dispatch, getWorkspaceDetailState } = React.useContext(
        GetWorkspaceContext
    );
    const {
        result: { address, description, email, fax, name, phone, status },
        err,
    } = getWorkspaceDetailState;

    // React.useEffect(() => {
    //     const { id } = getWorkspaceDetailState;
    //     if (id > -1 && token) {
    //         const convertId = id.toString();
    //         workspaceMiddleware.getWorkspace(dispatch, {
    //             id: convertId,
    //         });
    //     }
    // }, []);

    // HANDLE EXPIRED
    React.useEffect(() => {
        if (err?.error?.name === AUTH_CONST.TOKEN_EXPIRED) {
            if (setAuthStorage) {
                handleLogout(authDispatch, setAuthStorage);
            }
        }
    }, [err]);

    return (
        <>
            {/* Header */}
            <div className="bg-ooolab_gray_0 w-full h-ooolab_h_12 flex items-center py-ooolab_p_4 px-ooolab_p_4 text-sm">
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
                Workspace Details
            </div>
            {/* Workspace Avatar */}
            <div className="flex flex-col justify-center items-center pt-ooolab_p_12 pb-ooolab_p_6 border-b-2 border-gray-200">
                <img src={workspaceAvatar} alt="" className="mb-ooolab_m_5" />
                <p className="font-medium text-lg">This workspace 01</p>
            </div>
            {/* Workspace information */}
            <div className="w-full grid grid-cols-3 gap-2 pl-ooolab_p_4 pt-ooolab_p_12">
                <div className="col-span-1 text-ooolab_gray_0 text-sm mb-ooolab_m_3">
                    Name
                </div>
                <div className="col-span-2 font-normal text-sm">{name}</div>

                <div className="col-span-1 text-ooolab_gray_0 text-sm mb-ooolab_m_3">
                    Email Address
                </div>
                <div className="col-span-2 font-normal text-sm">{email}</div>

                <div className="col-span-1 text-ooolab_gray_0 text-sm mb-ooolab_m_3">
                    Status
                </div>
                <div className="col-span-2 font-normal text-sm">{status}</div>

                <div className="col-span-1 text-ooolab_gray_0 text-sm mb-ooolab_m_3">
                    Phone Number
                </div>
                <div className="col-span-2 font-normal text-sm">{phone}</div>

                <div className="col-span-1 text-ooolab_gray_0 text-sm mb-ooolab_m_3">
                    Fax Number
                </div>
                <div className="col-span-2 font-normal text-sm">
                    {fax || '-'}
                </div>

                <div className="col-span-1 text-ooolab_gray_0 text-sm mb-ooolab_m_3">
                    Address
                </div>
                <div className="col-span-2 font-normal text-sm">
                    {address || '-'}
                </div>

                <div className="col-span-1 text-ooolab_gray_0 text-sm mb-ooolab_m_3">
                    Members
                </div>
                <div className="col-span-2 font-normal text-sm">
                    <span
                        className="text-ooolab_blue_0 cursor-pointer"
                        onClick={() => onClose('member')}
                    >
                        View list
                    </span>
                </div>
            </div>
        </>
    );
};

export default WorkspaceDetailInformation;
