import * as React from 'react';
// COMPONENTS
import RegisterProvider from 'contexts/Auth/RegisterProvider';
import UpdateInformationForm from 'components/Authentication/AuthenticationRegisterForm/UpdateInformationForm';
import UpdateUserProvider from 'contexts/User/UpdateUserProvider';

export interface UpdateInformationPageProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateInformationPage: React.FC<UpdateInformationPageProps> = ({
    setAuthStorage,
}) => {
    return (
        <UpdateUserProvider>
            <div className={'h-screen p-ooolab_p_20'}>
                <div
                    className={
                        'relative flex flex-col items-center h-full bg-white shadow-ooolab_box_shadow_container_2 rounded-ooolab_radius_40px'
                    }
                >
                    <ul className="ooolab_pagination_parent_1 mt-ooolab_m_12">
                        <li className="ooolab_pagination_item_1" />
                        <li className="ooolab_pagination_item_1" />
                        <li className="ooolab_pagination_item_active_1" />
                    </ul>
                    <UpdateInformationForm />
                </div>
            </div>
        </UpdateUserProvider>
    );
};

export default UpdateInformationPage;
