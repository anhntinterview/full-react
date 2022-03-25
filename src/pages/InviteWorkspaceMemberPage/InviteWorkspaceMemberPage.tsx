import * as React from 'react';
// COMPONENT
import Header from 'components/Header';
import Footer from 'components/Footer';
import InviteWorkspaceMemberForm from 'components/User/InviteWorkspaceMemberForm';

// CONTEXT
import InviteMemberProvider from 'contexts/Workspace/InviteMemberProvider';
import GetListOfWorkspaceProvider from 'contexts/Workspace/GetListOfWorkspaceProvider';
import { AuthType } from 'types/Auth.type';

export interface InviteWorkspaceMemberPageProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
    storageUserInfo: AuthType;
}

const InviteWorkspaceMemberPage: React.FC<InviteWorkspaceMemberPageProps> = ({
    setAuthStorage,
    storageUserInfo,
}) => {
    return (
        <GetListOfWorkspaceProvider>
            <InviteMemberProvider>
                <Header isBreadcrumb />
                <InviteWorkspaceMemberForm
                    storageUserInfo={storageUserInfo}
                    setAuthStorage={setAuthStorage}
                />
                <Footer />
            </InviteMemberProvider>
        </GetListOfWorkspaceProvider>
    );
};

export default InviteWorkspaceMemberPage;
