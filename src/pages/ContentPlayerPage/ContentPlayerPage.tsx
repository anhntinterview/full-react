import * as React from 'react';
// COMPONENTS
import MasterPage from '../MasterPage';
// PROVIDER
import H5PProvider from 'contexts/H5P/H5PProvider';
import ContentPreview from 'components/ContentPreview';

export interface UserAccountSettingPageProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const ContentPlayerPage: React.FC<UserAccountSettingPageProps> = ({
    setAuthStorage,
}) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <H5PProvider>
                <ContentPreview />
            </H5PProvider>
        </MasterPage>
    );
};

export default ContentPlayerPage;
