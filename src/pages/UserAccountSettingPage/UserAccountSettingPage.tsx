import * as React from 'react';
// COMPONENTS
import AccountSettingForm from 'components/User/AccountSettingForm';
import MasterPage from 'pages/MasterPage';
import UpdateUserProvider from 'contexts/User/UpdateUserProvider';
import RouteMasterPage from 'pages/RouteMasterPage';

export interface UserAccountSettingPageProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserAccountSettingPage: React.FC<UserAccountSettingPageProps> = ({
    setAuthStorage,
}) => {
    return (
        <>
            <MasterPage setAuthStorage={setAuthStorage}>
                {/* <RouteMasterPage setAuthStorage={setAuthStorage}> */}
                    <UpdateUserProvider>
                        <AccountSettingForm />
                    </UpdateUserProvider>
                {/* </RouteMasterPage> */}
            </MasterPage>
        </>
    );
};

export default UserAccountSettingPage;
