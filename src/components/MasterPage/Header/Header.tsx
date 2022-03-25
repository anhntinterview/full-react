import React from 'react';
import { Link } from 'react-router-dom';
// COMPONENT
import MainNav from '../../MainNav';
import InviteWorkspaceMemberModal from 'components/Workspace/InviteWorkspaceMemberModal';

// MIDDLEWARE
import workspaceMiddleware from 'middleware/workspace.middleware';

// CONTEXT
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import InviteMemberProvider from 'contexts/Workspace/InviteMemberProvider';
import GetListOfWorkspaceProvider from 'contexts/Workspace/GetListOfWorkspaceProvider';
import { AuthContext } from 'contexts/Auth/AuthContext';

// ASSETS
import logo from 'assets/OoOLab_Logo_Icon.png';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';

// LOGIC
import { HeaderProps } from './HeaderFn';

// UTILS
import { handleLogout } from 'utils/handleLogout';
import {AUTH_CONST} from "constant/auth.const";

const Header: React.FC<HeaderProps> = ({
    setOpenUserDetail,
    onClickWorkspaceDetail,
    setAuthStorage,
}) => {
    const authCtx = React.useContext(AuthContext);
    const authDispatch = authCtx.dispatch;

    const userInfo = getLocalStorageAuthData();
    const { access_token } = userInfo;
    const {
        dispatch,
        getWorkspaceDetailState,
        getWorkspaceDetailState: { err },
    } = React.useContext(GetWorkspaceContext);
    const [isModal, setIsModal] = React.useState<boolean>(false);

    // React.useEffect(() => {
    //     const { id } = getWorkspaceDetailState;
    //     if (id > -1 && access_token) {
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
        <GetListOfWorkspaceProvider>
            <InviteMemberProvider>
                <div className="fixed flex items-center mt-0 ml-0 w-full h-ooolab_h_16_lg bg-white z-20 border-b-2">
                    <div className="w-1/5 px-ooolab_p_6 ">
                        <Link
                            to="/workspace/create"
                            className="w-ooolab_w_24 block"
                        >
                            <img src={logo} alt="_logo" className="w-full" />
                        </Link>
                    </div>
                    <div className="w-4/5 flex justify-between py-ooolab_p_3 pl-ooolab_p_16 pr-ooolab_p_6 h-full ">
                        <MainNav
                            token={access_token}
                            setIsModal={setIsModal}
                            setOpenUserDetail={setOpenUserDetail}
                            onClickWorkspaceDetail={onClickWorkspaceDetail}
                            setAuthStorage={setAuthStorage}
                        />
                    </div>
                </div>
                <InviteWorkspaceMemberModal
                    access_token={access_token}
                    isModal={isModal}
                    setIsModal={setIsModal}
                />
            </InviteMemberProvider>
        </GetListOfWorkspaceProvider>
    );
};

export default Header;
