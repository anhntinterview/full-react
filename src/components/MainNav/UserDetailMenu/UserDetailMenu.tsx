import * as React from 'react';
import { useParams, useHistory } from 'react-router-dom';
// PACKAGES
import { Link } from 'react-router-dom';
import { Popover, Transition } from '@headlessui/react';
// ASSETS
import Camera from 'assets/SVG/camera.svg';
import LogOut from 'assets/SVG/logout.svg';
// UTILS
import {
    getAttrLocalStorage,
    getCurrentEmail,
    getLocalStorageAuthData,
    isLocalStorageAuth,
    removeLocalStorageAuthData,
} from 'utils/handleLocalStorage';
// CONTEXTS
import { AuthContext } from 'contexts/Auth/AuthContext';
import { SET_AUTH } from 'actions/auth.action';
import { useState } from 'react';
import UpdateAvatarModal from 'components/User/AccountSettingForm/UpdateAvatarModal';
import { useTranslation } from 'react-i18next';
import { handleLogout } from 'utils/handleLogout';
import { UserContext } from 'contexts/User/UserContext';
import userMiddleware from 'middleware/user.middleware';
import workspaceMiddleware from 'middleware/workspace.middleware';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';

export interface UserDetailMenuProps {
    setOpenUserDetail?: React.Dispatch<React.SetStateAction<boolean>>;
    setAuthStorage?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function handleUserDetailForm(
    setOpenUserDetail: React.Dispatch<React.SetStateAction<boolean>>
) {
    return () => {
        setOpenUserDetail((prevState) => {
            return !prevState;
        });
    };
}

const UserDetailMenu: React.FC<UserDetailMenuProps> = ({ setAuthStorage }) => {
    const { t: translator } = useTranslation();
    const userInfo = getLocalStorageAuthData();
    const authCtx = React.useContext(AuthContext);
    const { dispatch: UserDispatch, userState } = React.useContext(UserContext);
    const { dispatch: WorkspaceDispatch } = React.useContext(
        GetWorkspaceContext
    );
    const { result: userInformation } = userState;
    const authDispatch = authCtx.dispatch;
    const param: { id: string; type?: string; folderId: string } = useParams();
    const history = useHistory();
    // function handleLogout() {
    //     authDispatch({ type: SET_AUTH.LOGOUT });
    //     removeLocalStorageAuthData(history.location.pathname);
    //     if (setAuthStorage) {
    //         setAuthStorage(isLocalStorageAuth());
    //     }
    //     history.push('/login');
    // }
    const [isShowUpdateAvatarModal, showUpdateAvatarModal] = useState(false);
    const currentEmail = getCurrentEmail();
    const name = getAttrLocalStorage('name', `user_info_${currentEmail}`);
    const email = getAttrLocalStorage('email', `user_info_${currentEmail}`);

    React.useEffect(() => {
        if (!userInformation.id) {
            userMiddleware.getUser(UserDispatch);
        }
    }, [userInformation]);

    const handleLogoutUser = () => {
        handleLogout(authDispatch, setAuthStorage, () => {
            userMiddleware.resetUserState(UserDispatch);
            workspaceMiddleware.resetUserState(WorkspaceDispatch);
        });
    };

    return (
        <Popover className="relative h-full w-full text-center" as="div">
            {({ open }) => (
                <>
                    <Popover.Button className="focus:outline-none">
                        <div className="shadow-ooolab_sub_item rounded-full hover:shadow-ooolab_box_shadow_1 w-ooolab_w_10 h-ooolab_h_10 flex items-center bg-white justify-center hover:bg-ooolab_blue_1">
                            <img
                                src={userInformation?.avatar_url}
                                alt="_avatar"
                                className="rounded-full w-full h-full object-cover"
                            />
                        </div>
                    </Popover.Button>

                    <Transition
                        show={open}
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Popover.Panel className="absolute z-70 left-0 bg-white rounded-header_menu  pt-ooolab_p_4 px-ooolab_p_4 w-ooolab_w_40 shadow-ooolab_box_userinfo overflow-hidden mt-ooolab_m_1">
                            <div className="relative w-ooolab_w_12 h-ooolab_h_12 m-auto drop-shadow shadow-ooolab_box_shadow_2 rounded-full">
                                <img
                                    src={userInformation?.avatar_url || ''}
                                    alt="_avatar"
                                    className="rounded-full object-cover w-ooolab_w_12 h-ooolab_h_12"
                                />
                                <div
                                    onClick={() => showUpdateAvatarModal(true)}
                                    className="absolute  bottom-ooolab_n_inset_camera right-ooolab_n_inset_camera p-ooolab_p_1 bg-white rounded-full cursor-pointer  group"
                                >
                                    <div
                                        className="rounded-full flex items-center justify-center w-ooolab_w_6 h-ooolab_h_6 group-hover:bg-ooolab_gray_11"
                                        style={{
                                            boxShadow:
                                                '0px 0px 1px rgba(40, 41, 61, 0.08), 0px 0.5px 2px rgba(96, 97, 112, 0.16)',
                                        }}
                                    >
                                        <img
                                            src={Camera}
                                            alt="_camera"
                                            className="w-ooolab_w_2_root h-ooolab_h_2"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="text-ooolab_text_username text-ooolab_xs text-center mt-ooolab_m_5 font-medium">
                                {userInformation?.display_name || ''}
                            </div>
                            <div className="text-ooolab_text_bar_inactive text-ooolab_10px text-center break-words">
                                {userInformation?.email || ''}
                            </div>
                            <Link to={`/workspace/${param.id}/user-setting`}>
                                <div
                                    className="py-ooolab_p_1_e text-ooolab_xs text-center mt-ooolab_m_5 rounded-sub_tab hover:bg-ooolab_gray_11 hover:text-ooolab_blue_4 text-ooolab_dark_1 "
                                    style={{
                                        boxShadow:
                                            '0px 0px 1px rgba(40, 41, 61, 0.08), 0px 0.5px 2px rgba(96, 97, 112, 0.16)',
                                    }}
                                >
                                    {translator(
                                        'ACCOUNT_SETTING.ACCOUNT_SETTINGS'
                                    )}
                                </div>
                            </Link>
                            <div className="relative mt-ooolab_m_7 flex mb-ooolab_m_2">
                                <div className="text-ooolab_8px text-ooolab_dark_2 font-medium flex items-end">
                                    {translator('TERMS_OF_SERVICE')}
                                </div>
                                <div
                                    onClick={handleLogoutUser}
                                    className="logout-icon ml-auto cursor-pointer flex items-center justify-center rounded-full border border-ooolab_border_logout w-ooolab_w_7_n h-ooolab_h_7 hover:bg-ooolab_bg_logout_hover"
                                >
                                    <svg
                                        className="w-ooolab_w_2_i h-ooolab_h_2_i"
                                        viewBox="0 0 12 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M5.9999 0.75C5.67907 0.75 5.41657 1.0125 5.41657 1.33333V6C5.41657 6.32083 5.67907 6.58333 5.9999 6.58333C6.32073 6.58333 6.58323 6.32083 6.58323 6V1.33333C6.58323 1.0125 6.32073 0.75 5.9999 0.75ZM8.99823 2.41833C8.77073 2.64583 8.77657 3.00167 8.9924 3.22917C9.65157 3.92917 10.0599 4.8625 10.0832 5.895C10.1357 8.12917 8.28657 10.0542 6.0524 10.0775C3.77157 10.1125 1.91657 8.275 1.91657 6C1.91657 4.92667 2.33073 3.9525 3.0074 3.22333C3.22323 2.99583 3.22323 2.64 3.00157 2.41833C2.76823 2.185 2.38907 2.19083 2.1674 2.43C1.32157 3.32833 0.790732 4.52417 0.749898 5.84833C0.668232 8.695 2.98407 11.1567 5.83073 11.2442C8.80573 11.3375 11.2499 8.95167 11.2499 5.99417C11.2499 4.61167 10.7132 3.36333 9.83823 2.43C9.61657 2.19083 9.23157 2.185 8.99823 2.41833V2.41833Z"
                                            fill="#2E3A59"
                                        />
                                    </svg>
                                </div>
                                <div className="absolute right-ooolab_n_inset_logout_r bottom-ooolab_n_inset_logout_b invisible bg-ooolab_bg_logout_tooltip rounded-sub_tab px-2 py-1 text-white text-ooolab_sxs">
                                    Log Out
                                </div>
                            </div>
                        </Popover.Panel>
                    </Transition>
                    {isShowUpdateAvatarModal && (
                        <UpdateAvatarModal
                            avatar_url={userInformation?.avatar_url}
                            onUpdatedAvatar={() => {
                                showUpdateAvatarModal(false);
                                userMiddleware.getUser(UserDispatch);
                            }}
                            onCancel={() => showUpdateAvatarModal(false)}
                        />
                    )}
                </>
            )}
        </Popover>
    );
};

export default UserDetailMenu;
