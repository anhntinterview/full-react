import * as React from 'react';
// COMPONENTS
import { H5PBuilder } from 'components/H5P/H5PComponents';
import MasterPage from '../MasterPage';
import H5PProvider from 'contexts/H5P/H5PProvider';
import RouteMasterPage from 'pages/RouteMasterPage';

export interface UserAccountSettingPageProps {
    setAuthStorage: React.Dispatch<React.SetStateAction<boolean>>;
}

const H5PBuilderPage: React.FC<UserAccountSettingPageProps> = ({
    setAuthStorage,
}) => {
    return (
        <>
            <MasterPage setAuthStorage={setAuthStorage}>
                <H5PProvider>
                    <H5PBuilder>
                        <RouteMasterPage setAuthStorage={setAuthStorage} />
                    </H5PBuilder>
                </H5PProvider>
            </MasterPage>
        </>
    );
};

export default H5PBuilderPage;
