import { Menu, Transition } from '@headlessui/react';
import React, { useContext, useEffect, useState } from 'react';
import {
    GetListOfWorkspaceContext,
    GetWorkspaceContext,
} from 'contexts/Workspace/WorkspaceContext';
import {
    GetListOfWorkspaceType,
    WorkspaceItem,
} from 'types/GetListOfWorkspace.type';
import SwitchWorkspace from 'assets/SVG/SwitchWorkspace.svg';
import { useTranslation } from 'react-i18next';

const WorkspaceMenu: React.FC<{
    open: boolean;
}> = ({ open }) => {
    const { t: translator } = useTranslation();
    const [
        currentWorkspace,
        setCurrentWorkspace,
    ] = useState<GetListOfWorkspaceType>();
    const getListOfWorkspaceCtx = useContext(GetListOfWorkspaceContext);
    const { getListOfWorkspaceState } = getListOfWorkspaceCtx;
    const getListOfWorkspaceStateResult = getListOfWorkspaceState.result;
    const { dispatch: workspaceDispatch, getWorkspaceDetailState } = useContext(
        GetWorkspaceContext
    );

    const { result: WorkspaceDetailInformation } = getWorkspaceDetailState;
    useEffect(() => {
        setCurrentWorkspace(getListOfWorkspaceStateResult);
    }, [getListOfWorkspaceStateResult]);

    function handleSelectedWorkspace(e: any) {
        // window.location.href = `/workspace/${e.id}`;
        window.location.href = `/workspace/${e.id}/h5p-content`;
    }

    return (
        <>
            <div className="flex">
                <Menu.Button className="w-full focus:outline-none">
                    <div className="flex items-center whitespace-nowrap text-left text-ooolab_xs group py-ooolab_p_3 text-ooolab_dark_2  ml-ooolab_m_2 px-ooolab_p_4 mr-ooolab_m_3 mb-ooolab_m_1 cursor-pointer hover:bg-ooolab_gray_11 hover:text-ooolab_dark_1">
                        <div className="w-ooolab_w_5">
                            <svg
                                className="w-ooolab_w_3_i h-ooolab_h_3_i"
                                viewBox="0 0 14 14"
                                fill="none"
                            >
                                <path
                                    d="M4.33398 12.3335V13.6215C4.33409 13.6849 4.31611 13.747 4.28216 13.8005C4.24821 13.854 4.1997 13.8968 4.14232 13.9237C4.08493 13.9507 4.02106 13.9607 3.95818 13.9526C3.8953 13.9445 3.83603 13.9187 3.78732 13.8781L1.04065 11.5895C0.98797 11.5455 0.950125 11.4864 0.932278 11.4202C0.914431 11.354 0.917453 11.2838 0.940929 11.2194C0.964406 11.1549 1.0072 11.0993 1.06346 11.06C1.11972 11.0208 1.18672 10.9999 1.25532 11.0001H11.0007C11.3543 11.0001 11.6934 10.8597 11.9435 10.6096C12.1935 10.3596 12.334 10.0204 12.334 9.6668V4.33346H13.6673V9.6668C13.6673 10.374 13.3864 11.0523 12.8863 11.5524C12.3862 12.0525 11.7079 12.3335 11.0007 12.3335H4.33398ZM9.66732 1.6668V0.378798C9.66721 0.315403 9.68519 0.253293 9.71914 0.199754C9.75309 0.146215 9.8016 0.103467 9.85898 0.0765242C9.91637 0.0495814 9.98025 0.0395613 10.0431 0.0476392C10.106 0.0557171 10.1653 0.081558 10.214 0.122131L12.9607 2.4108C13.0133 2.45469 13.0511 2.51375 13.069 2.57991C13.0868 2.64608 13.0839 2.71615 13.0605 2.78057C13.0371 2.84499 12.9944 2.90064 12.9383 2.93993C12.8821 2.97921 12.8152 3.00024 12.7467 3.00013H3.00065C2.64703 3.00013 2.30789 3.14061 2.05784 3.39066C1.80779 3.6407 1.66732 3.97984 1.66732 4.33346V9.6668H0.333984V4.33346C0.333984 3.62622 0.614936 2.94794 1.11503 2.44785C1.61513 1.94775 2.29341 1.6668 3.00065 1.6668H9.66732Z"
                                    fill="#8F90A6"
                                    className="group-hover:fill-ooolab_bg_dark"
                                />
                            </svg>
                        </div>
                        {translator('DASHBOARD.SIDEBAR.SWITCH_WORKSPACE')}
                    </div>
                </Menu.Button>
            </div>

            <Transition
                show={open}
                as="div"
                className="absolute bg-white rounded-header_menu left-full top-ooolab_n_inset_logout_b shadow-ooolab_menu h-ooolab_h_36 flex flex-col overflow-y-auto focus:outline-none"
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items>
                    {currentWorkspace?.items?.map(
                        (item: WorkspaceItem, index: number) => (
                            <Menu.Item key={item.id}>
                                <div
                                    onClick={() =>
                                        handleSelectedWorkspace(item)
                                    }
                                    className="text-ooolab_sm pl-3 py-1.5 pr-ooolab_p_20 cursor-pointer hover:bg-ooolab_bg_sub_tab_hover flex whitespace-nowrap text-left outline-none"
                                >
                                    {item.name}
                                </div>
                            </Menu.Item>
                        )
                    )}
                </Menu.Items>
            </Transition>
        </>
    );
};

export default WorkspaceMenu;
