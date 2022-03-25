import * as React from 'react';

// COMPONENT
import Header from 'components/Header';
import Footer from 'components/Footer';
import UpdatePasswordForm from 'components/User/UpdatePasswordForm';
// TYPES
import { AuthType } from 'types/Auth.type';

export interface UpdatePasswordPageProps {
    storageUserInfo: AuthType;
}

const UpdatePasswordPage: React.FC<UpdatePasswordPageProps> = ({
    storageUserInfo,
}) => {
    return (
        <>
            <Header />
            <UpdatePasswordForm
                storageUserInfo={storageUserInfo}
            />
            <Footer />
        </>
    );
};

export default UpdatePasswordPage;
