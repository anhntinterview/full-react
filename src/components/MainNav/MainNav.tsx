import React from 'react';
// PACKAGE
// COMPONENTS
import SearchInput from './SearchInput';
import UserDetailMenu from './UserDetailMenu';
import WorkspaceDetailMenu from './WorkspaceDetailMenu';
import ListWorkspace from './ListWorkspace';

export interface MainNavProps {
    token: string | undefined;
    setIsModal: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenUserDetail?: React.Dispatch<React.SetStateAction<boolean>>;
    onClickWorkspaceDetail?: (type?: string) => void;
    setAuthStorage?: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainNav: React.FC<MainNavProps> = ({
    setOpenUserDetail,
    setAuthStorage,
    onClickWorkspaceDetail,
    setIsModal,
}) => {
    return (
        <>
            {/* search bar */}
            <SearchInput />

            {/* workspace stuff */}
            <div className="flex items-center ">
                {/* <div className="flex flex-col items-center h-ooolab_h_16_lg">
                    <ListWorkspace />
                   
                </div> */}
                <WorkspaceDetailMenu
                    onClickWorkspaceDetail={onClickWorkspaceDetail}
                    setIsModal={setIsModal}
                />
                <div className="w-ooolab_w_0.0625 bg-ooolab_vertical_line h-full mx-ooolab_m_6" />
                <div className="relative mr-ooolab_m_8 pb-ooolab_p_2">
                    <div className=" absolute flex items-center justify-center w-ooolab_w_4 h-ooolab_h_4 bg-red-600 border-2 border-white text-xs text-white rounded-full -top-2 -right-1">
                        2
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-ooolab_gray_6 h-ooolab_h_icon_notification w-ooolab_w_icon_notification"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                </div>
                <div className="flex items-center pb-ooolab_p_2">
                    <UserDetailMenu
                        setAuthStorage={setAuthStorage}
                        setOpenUserDetail={setOpenUserDetail}
                    />
                </div>
            </div>
        </>
    );
};

export default MainNav;
