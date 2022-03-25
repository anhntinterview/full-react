import * as React from 'react';
// COMPONENTS
import MasterPage from '../MasterPage';
import H5PPreview from 'components/H5PPreview';
export interface UserAccountSettingPageProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const H5PPreviewPage: React.FC<UserAccountSettingPageProps> = ({
    setAuthStorage,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <H5PPreview />
        </MasterPage>
    );
};

export default H5PPreviewPage;
