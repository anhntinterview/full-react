import * as React from 'react';
// PACKAGE
import { useHistory } from 'react-router-dom';
// COMPONENT
import CommonModals from 'components/CommonModals';
import Header from 'components/Header';
import Footer from 'components/Footer';
import CreateWorkspaceForm from 'components/User/CreateWorkspaceForm';
// PROVIDER
import CreateWorkspaceProvider from 'contexts/Workspace/CreateWorkspaceProvider';
import GetListOfWorkspaceProvider from 'contexts/Workspace/GetListOfWorkspaceProvider';
// CONSTANTS
import { HOME_PAGE_MODALS } from 'constant/modal.const';
// CONTEXT
import { AuthContext } from 'contexts/Auth/AuthContext';
import {
    CreateWorkspacePageProps,
    handleModalAgree,
    handleModalDismiss,
} from './MyWorkspacePageFn';
import MyWorkspaceForm from 'components/User/MyWorkspaceForm';

const MyWorkspacePage: React.FC<CreateWorkspacePageProps> = ({
    setAuthStorage,
    storageUserInfo,
}) => {
    const history = useHistory();
    const { authState, dispatch } = React.useContext(AuthContext);
    const { defaultPassword } = authState;

    React.useEffect(() => {
        return () => {
            localStorage.removeItem('google_auth');
        };
    }, []);

    return (
        <CreateWorkspaceProvider>
            <GetListOfWorkspaceProvider>
                <div className={'h-screen p-ooolab_p_20 '}>
                    <div className="flex flex-col items-center h-full bg-white shadow-ooolab_box_shadow_container_2 rounded-ooolab_radius_40px overflow-y-auto">
                        <MyWorkspaceForm
                            setAuthStorage={setAuthStorage}
                            storageUserInfo={storageUserInfo}
                        />
                    </div>
                </div>
            </GetListOfWorkspaceProvider>
        </CreateWorkspaceProvider>
    );
};

export default MyWorkspacePage;
