import React, {
    Fragment,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    generateAppNewBars,
    HiddenMenuIcon,
    NewBarType,
} from 'constant/setupBars.const';
import {
    GetListOfWorkspaceContext,
    GetWorkspaceContext,
} from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';
import DefaultWorkspaceAva from 'assets/SVG/workspace_avatar.svg';

import { useHistory, useParams } from 'react-router-dom';
import Workspace from 'assets/workspace.png';

import logo_fullblack from 'assets/logo_fullblack.png';

import { useTranslation } from 'react-i18next';
import { Menu, Transition } from '@headlessui/react';
import SubMenuNavigation from './LeftNavComponent/SubMenuNavigation';
import { MenuIcon, PlusIcon } from '@heroicons/react/outline';
import Tooltip from 'components/Tooltip';
import CreateMenu from './CreateMenu';
import WorkspaceMenu from './WorkspaceMenu/WorkspaceMenu';
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import { AUTH_CONST } from 'constant/auth.const';
import UserDetailMenu from 'components/MainNav/UserDetailMenu';

import './style.css';

export interface NewLeftMenuProps {
    tabType: NewBarType;
    setHiddenMenu: React.Dispatch<React.SetStateAction<boolean>>;
    hiddenMenu: boolean;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const NewLeftMenu: React.FC<NewLeftMenuProps> = ({
    tabType,
    hiddenMenu,
    setHiddenMenu,
    setAuthStorage,
}) => {
    const { t: translator } = useTranslation();
    const history = useHistory();
    const userInfo = getLocalStorageAuthData();
    const param: { id: string; type?: string; folderId: string } = useParams();
    const { dispatch: workspaceDispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );

    const [selectedMenu, setSelectedMenu] = React.useState<number>(-1);

    const getListOfWorkspaceCtx = useContext(GetListOfWorkspaceContext);
    const getListOfWorkspaceDispatch = getListOfWorkspaceCtx.dispatch;

    const { result: WorkspaceDetailInformation } = getWorkspaceDetailState;
    const {
        membership: { role, type },
    } = WorkspaceDetailInformation;

    useEffect(() => {
        workspaceMiddleware.getListOfWorkspace(getListOfWorkspaceDispatch);

        // return () => {
        //     workspaceMiddleware.resetUserState(workspaceDispatch);
        // };
    }, []);

    // useEffect(() => {
    //     if (WorkspaceDetailInformation.id === -1) {
    //         workspaceMiddleware.getWorkspace(workspaceDispatch, {
    //             id: param.id,
    //         });
    //     }
    // }, [WorkspaceDetailInformation]);

    useEffect(() => {
        const { err } = getWorkspaceDetailState;
        if (
            err?.error?.name === AUTH_CONST.FORBIDDEN ||
            err?.error?.name === AUTH_CONST.NOT_FOUND
        ) {
            console.log('push');
            history.push('/');
        }
    }, [getWorkspaceDetailState.err]);

    const appBars = useMemo(
        () =>
            generateAppNewBars({
                workspaceId: param.id,
                isAdmin: role === 'admin' ? true : false,
                translator,
                type,
            }),
        [role, param.id, translator, type]
    );

    const currentParentTab = useMemo(
        () => appBars.find((item: any) => item.type === tabType),
        [tabType]
    );

    useEffect(() => {
        if (currentParentTab !== undefined) {
            setSelectedMenu(currentParentTab.id);
        }
    }, [currentParentTab]);

    return (
        <>
            <div
                className={`${
                    hiddenMenu && selectedMenu === -1
                        ? 'w-ooolab_w_20'
                        : 'w-ooolab_w_54'
                }  transition-width z-20 fixed top-0 left-0 bottom-0 bg-white shadow-ooolab_box_menu_left h-screen`}
            >
                <div className="flex items-center px-ooolab_p_5 py-ooolab_p_2 h-ooolab_h_1/10">
                    <div className="flex items-center">
                        <UserDetailMenu setAuthStorage={setAuthStorage} />
                    </div>
                    <div
                        className={`flex justify-end  items-center w-full ${
                            hiddenMenu && selectedMenu !== -1 && 'hidden'
                        }`}
                    >
                        <img
                            onClick={() => history.push('/')}
                            src={logo_fullblack}
                            className="w-ooolab_w_24   cursor-pointer"
                        />
                        {/* {hiddenMenu ? (
                        <div className=" w-full flex justify-center">
                            <MenuIcon
                                className=" w-ooolab_w_4 h-ooolab_h_4 cursor-pointer   "
                                onClick={() => setHiddenMenu(!hiddenMenu)}
                            />
                        </div>
                    ) : (
                        <>
                            <img
                                src={logo_fullblack}
                                className="w-ooolab_w_20 h-ooolab_h_6  "
                            />
                            <div
                                className="cursor-pointer"
                                onClick={() => setHiddenMenu(!hiddenMenu)}
                            >
                                <HiddenMenuIcon />
                            </div>
                        </>
                    )} */}
                    </div>
                </div>

                <div className="pl-ooolab_p_3  mb-ooolab_m_10  h-2/4">
                    <div>
                        <div>
                            <div className=" w-11/12 h-full ">
                                {appBars.map((bar: any, index: number) => (
                                    <>
                                        {selectedMenu === -1 && (
                                            <div
                                                className={`flex items-center py-ooolab_p_4 px-ooolab_p_5 group hover:bg-ooolab_light_100  cursor-pointer w-full ${
                                                    hiddenMenu &&
                                                    'justify-center'
                                                }`}
                                                onClick={() =>
                                                    setSelectedMenu(bar.id)
                                                }
                                            >
                                                <div
                                                    className={`${
                                                        !hiddenMenu &&
                                                        'pr-ooolab_p_4'
                                                    }`}
                                                >
                                                    {bar.icon}
                                                </div>
                                                <div
                                                    className={`${
                                                        hiddenMenu && 'hidden'
                                                    } text-ooolab_dark_2 text-ooolab_xs font-semibold group-hover:text-ooolab_dark_1`}
                                                >
                                                    {bar.title}
                                                </div>
                                            </div>
                                        )}

                                        <Transition
                                            show={selectedMenu !== -1}
                                            as="div"
                                            className=""
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                        >
                                            <div>
                                                <SubMenuNavigation
                                                    key={`bar-${bar.id}`}
                                                    bar={
                                                        selectedMenu ===
                                                            bar.id && bar
                                                    }
                                                    setSelectedMenu={
                                                        setSelectedMenu
                                                    }
                                                />
                                            </div>
                                        </Transition>
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className=" pl-ooolab_p_3 absolute bottom-ooolab_h_12 w-full">
                    <div className="border  bg-ooolab_gray_10 w-11/12 "></div>
                    <div className="text-ooolab_dark_1 text-ooolab_10px p-ooolab_p_4 font-semibold">
                        Workspace
                    </div>
                    <div
                        onClick={() => {
                            history.push(`/workspace/${param.id}/setting`);
                        }}
                        className="flex items-center ml-ooolab_m_2 px-ooolab_p_4 mr-ooolab_m_3 hover:bg-ooolab_gray_11 py-ooolab_p_1_e cursor-pointer mb-ooolab_m_1"
                    >
                        <Tooltip
                            title={`${translator(
                                'DASHBOARD.WORKSPACE_SETTING.WORKSPACE_SETTINGS'
                            )}`}
                            mlClass="ml-0"
                        >
                            <div className=" justify-center mr-ooolab_m_4">
                                <img
                                    src={
                                        WorkspaceDetailInformation.avatar_url ||
                                        DefaultWorkspaceAva
                                    }
                                    alt="workspace"
                                    className={`block rounded-ooolab_circle w-ooolab_w_8 h-ooolab_h_8 ${
                                        WorkspaceDetailInformation.avatar_url
                                            ? 'object-cover'
                                            : ''
                                    }`}
                                />
                            </div>
                        </Tooltip>
                        <div className="text-ooolab_xs font-semibold text-ooolab_dark_1">
                            {WorkspaceDetailInformation.name.length < 15
                                ? WorkspaceDetailInformation?.name
                                : `${WorkspaceDetailInformation?.name?.slice(
                                      0,
                                      16
                                  )}...`}
                        </div>
                    </div>
                    <div className="ml-ooolab_m_1 py-ooolab_p_1 relative">
                        <Menu as="div">
                            {({ open }) => <WorkspaceMenu open={open} />}
                        </Menu>
                    </div>
                    <div
                        onClick={() => history.push('/workspace/create')}
                        className="flex items-center py-ooolab_p_3 text-ooolab_dark_2 ml-ooolab_m_3 text-ooolab_xs px-ooolab_p_3 hover:bg-ooolab_gray_11 cursor-pointer  mr-ooolab_m_3 hover:text-ooolab_dark_1"
                    >
                        <PlusIcon className="w-ooolab_w_5 h-ooolab_h_5 mr-ooolab_m_1" />
                        {translator('DASHBOARD.SIDEBAR.NEW_WOKSPACE')}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NewLeftMenu;
