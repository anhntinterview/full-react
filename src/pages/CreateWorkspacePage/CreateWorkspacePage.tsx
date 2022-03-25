import * as React from 'react';
// PACKAGE
import {useHistory} from 'react-router-dom';
// COMPONENT
import CommonModals from 'components/CommonModals';
import Header from 'components/Header';
import Footer from 'components/Footer';
import CreateWorkspace from 'components/User/CreateWorkspaceForm';
// PROVIDER
import CreateWorkspaceProvider from 'contexts/Workspace/CreateWorkspaceProvider';
import GetListOfWorkspaceProvider from 'contexts/Workspace/GetListOfWorkspaceProvider';
// CONSTANTS
import {HOME_PAGE_MODALS} from 'constant/modal.const';
// CONTEXT
import {AuthContext} from 'contexts/Auth/AuthContext';
import {
    CreateWorkspacePageProps,
    handleModalAgree,
    handleModalDismiss,
} from './CreateWorkspacePageFn';
import {useState} from "react";

const CreateWorkspacePage: React.FC<CreateWorkspacePageProps> = ({
                                                                     setAuthStorage,
                                                                     storageUserInfo,
                                                                 }) => {
    const history = useHistory();
    const {authState, dispatch} = React.useContext(AuthContext);
    const {defaultPassword} = authState;
    const [tab, changeTab] = useState(0);
    React.useEffect(() => {
        return () => {
            localStorage.removeItem('google_auth');
        };
    }, []);

    return (
        <CreateWorkspaceProvider>
            <GetListOfWorkspaceProvider>
                <div className={'h-screen p-ooolab_p_20 '}>
                    <div
                        className="flex flex-col items-center h-full bg-white shadow-ooolab_box_shadow_container_2 rounded-ooolab_radius_40px">
                        <ul className="flex box-border justify-between mt-ooolab_m_12 w-ooolab_w_20">
                            <li className={`${tab === 0 ? 'ooolab_pagination_item_active_1' : 'ooolab_pagination_item_1'}`}/>
                            <li className={`${tab === 1 ? 'ooolab_pagination_item_active_1' : 'ooolab_pagination_item_1'}`}/>
                        </ul>
                        <CreateWorkspace
                            setAuthStorage={setAuthStorage}
                            storageUserInfo={storageUserInfo}
                            changeTab={tab => {
                                changeTab(tab);
                            }}
                            tab={tab}
                        />
                    </div>
                </div>
            </GetListOfWorkspaceProvider>
        </CreateWorkspaceProvider>
    );
};

export default CreateWorkspacePage;
