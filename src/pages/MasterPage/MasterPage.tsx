import React, { useContext } from 'react';
// PACKAGE
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { debounce } from 'lodash';
// COMPONENTS
import UserDetailForm from 'components/User/UserProfile/UserDetailForm';
import EditUserProfileModal from 'components/User/UserProfile/EditUserProfileModal';
import {
    WorkspaceDetailInformation,
    WorkspaceListMembers,
} from 'components/Workspace/WorkspaceInformation';
import WorkspaceOverlay from 'components/Workspace/WorkspaceOverlay';
// CONTEXT
import GoogleAPIAndServicesProvider from 'contexts/Google/GoogleAPIAndServicesProvider';
// PROVIDER
import WorkspaceDetailProvider from 'contexts/Workspace/WorkspaceDetailProvider';
import LeftMenuProvider from 'contexts/LeftMenu/LeftMenuProvider';
// UTILS
import { getLocalStorageAuthData } from 'utils/handleLocalStorage';
import Google from 'components/MasterPage/Google';
import { genClassNames } from 'utils/handleString';
import GetListOfWorkspaceProvider from 'contexts/Workspace/GetListOfWorkspaceProvider';
import InviteMemberProvider from 'contexts/Workspace/InviteMemberProvider';
import { PrivateRouteContext } from 'contexts/PrivateRoute/PrivateRouteContext';
import LeftNavigation from 'components/MasterPage/LeftNavigation';
import UploadAvatarProvider from '../../contexts/User/UploadAvatarProvider';
import NewLeftMenu from 'components/MasterPage/LeftNavigation/NewLeftMenu';
import Header from 'components/Header';

export interface MasterPageProps {
    isAuthStorage?: boolean;
    setCheckTokenGoogle?: React.Dispatch<React.SetStateAction<boolean>>;
    // setIsCreateFolder?: React.Dispatch<React.SetStateAction<boolean>>;
    setAuthStorage?: React.Dispatch<React.SetStateAction<boolean>>;
}

const MasterPage: React.FC<MasterPageProps> = ({
    children,
    setAuthStorage,
}) => {
    const { barType, newBarType } = useContext(PrivateRouteContext);
    const { access_token } = getLocalStorageAuthData();
    const [openUserDetail, setOpenUserDetail] = React.useState<boolean>(false);
    const [openEditUserModal, setOpenEditUserModal] = React.useState<boolean>(
        false
    );
    const [hasWorkspaceDrive, setHasWorkspaceDrive] = React.useState<
        boolean | string
    >('');
    const [overlayVisible, setOverlayVisible] = React.useState<boolean>(false);
    const [overlayType, setOverlayType] = React.useState<string>('');
    const [hiddenMenu, setHiddenMenu] = React.useState<boolean>(false);

    const handleToggleOverlay = (type?: string) => {
        if (type) {
            setOverlayType(type);
            setOverlayVisible(true);
        } else {
            setOverlayVisible(false);
            debounce(() => setOverlayType(''), 500);
        }
    };
    const returnComponent = (key: string) => {
        switch (key) {
            case 'detail':
                return (
                    <WorkspaceDetailInformation
                        token={access_token}
                        onClose={handleToggleOverlay}
                        setAuthStorage={setAuthStorage}
                    />
                );
            case 'member':
                return (
                    <WorkspaceListMembers
                        token={access_token}
                        onClose={handleToggleOverlay}
                    />
                );
            default:
                break;
        }
    };
    return (
        <UploadAvatarProvider>
            <LeftMenuProvider>
                <GoogleAPIAndServicesProvider>
                    <DndProvider backend={HTML5Backend}>
                        {barType !== undefined ? (
                            <GetListOfWorkspaceProvider>
                                <InviteMemberProvider>
                                    {/* <Header setAuthStorage={setAuthStorage} /> */}
                                    {/* <LeftNavigation
                                        tabType={barType}
                                        setHasWorkspaceDrive={
                                            setHasWorkspaceDrive
                                        }
                                        onClickWorkspaceDetail={
                                            handleToggleOverlay
                                        }
                                        setOpenUserDetail={setOpenUserDetail}
                                        setAuthStorage={setAuthStorage}
                                    /> */}
                                    <NewLeftMenu
                                        tabType={newBarType}
                                        setHiddenMenu={setHiddenMenu}
                                        hiddenMenu={hiddenMenu}
                                        setAuthStorage={setAuthStorage}
                                    />
                                </InviteMemberProvider>
                            </GetListOfWorkspaceProvider>
                        ) : (
                            <div className="hidden" />
                        )}
                        <div
                            className={genClassNames({
                                'overflow-hidden transition-width': true,
                                'pl-ooolab_p_54':
                                    barType !== undefined && !hiddenMenu,
                                'pl-ooolab_p_20':
                                    barType !== undefined && hiddenMenu,
                            })}
                        >
                            {/* {barType !== undefined && (
                                <Google hasWorkspaceDrive={hasWorkspaceDrive} />
                            )} */}
                            <div className="w-full overflow-y-auto">
                                {children}
                            </div>
                        </div>
                        <UserDetailForm
                            openUserDetail={openUserDetail}
                            setOpenUserDetail={setOpenUserDetail}
                            setOpenEditUserModal={setOpenEditUserModal}
                        />
                        <EditUserProfileModal
                            titleText="Edit profile"
                            openEditUserModal={openEditUserModal}
                            setOpenEditUserModal={setOpenEditUserModal}
                            setAuthStorage={setAuthStorage}
                        />
                        <WorkspaceOverlay
                            onClickBackdrop={handleToggleOverlay}
                            component={returnComponent(overlayType)}
                            show={overlayVisible}
                        />
                    </DndProvider>
                </GoogleAPIAndServicesProvider>
            </LeftMenuProvider>
        </UploadAvatarProvider>
    );
};

export default MasterPage;
