import * as React from 'react';

// COMPONENT
import CreatePasswordForm from 'components/Authentication/AuthenticationRegisterForm/CreatePasswordForm';
// TYPES
import { AuthType } from 'types/Auth.type';
// CONTEXT
import RegisterProvider from 'contexts/Auth/RegisterProvider';

export interface CreatePasswordPageProps {
    storageUserInfo: AuthType;
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    storageUserInfoSession: AuthType;
}

const CreatePasswordPage: React.FC<CreatePasswordPageProps> = ({
    storageUserInfo,
    setAuthStorage,
    storageUserInfoSession,
}) => {
    return (
        <div className={'h-screen p-ooolab_p_20'}>
            <div
                className={
                    'flex flex-col items-center h-full bg-white shadow-ooolab_box_shadow_container_2 rounded-ooolab_radius_40px justify-between'
                }
            >
                <ul className="ooolab_pagination_parent_1 mt-ooolab_m_12">
                    <li className="ooolab_pagination_item_1" />
                    <li className="ooolab_pagination_item_active_1" />
                    <li className="ooolab_pagination_item_1" />
                </ul>
                <CreatePasswordForm
                    storageUserInfo={storageUserInfo}
                    setAuthStorage={setAuthStorage}
                    storageUserInfoSession={storageUserInfoSession}
                />
            </div>
        </div>
    );
};

export default CreatePasswordPage;
