import * as React from 'react';
// COMPONENTS
import H5PPlayer from 'components/H5P/H5PPlayer';
import MasterPage from '../MasterPage';
// PROVIDER
import H5PProvider from 'contexts/H5P/H5PProvider';
import RouteMasterPage from 'pages/RouteMasterPage';

export interface UserAccountSettingPageProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const H5PPage: React.FC<UserAccountSettingPageProps> = ({ setAuthStorage }) => {
    return (
        <MasterPage setAuthStorage={setAuthStorage}>
            <H5PProvider>
                <H5PPlayer>
                    <RouteMasterPage
                        setAuthStorage={setAuthStorage}
                    ></RouteMasterPage>
                </H5PPlayer>
            </H5PProvider>
        </MasterPage>
    );
};

export default H5PPage;
