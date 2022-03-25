import WorkspaceDetailProvider from 'contexts/Workspace/WorkspaceDetailProvider';
import * as React from 'react';
// PACKAGE
import { QueryClient, QueryClientProvider } from 'react-query';
// COMPONENT
import AppContainer from './AppContainer';
// CONTEXT
import AuthProvider from './contexts/Auth/AuthProvider';
import PasswordProvider from './contexts/Password/PasswordProvider';
import UserProvider from './contexts/User/UserProvider';
// CONST
// UTILS
import { isLocalStorageAuth } from './utils/handleLocalStorage';
import { isUserLoggedIn } from 'utils/handleAuthorized';
import RegisterProvider from 'contexts/Auth/RegisterProvider';
import ReportProvider from 'contexts/Report/ReportProvider';
declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        webkitdirectory?: string;
        mozdirectory?: string;
        directory?: string;
    }
}

const queryClient = new QueryClient();

const App: React.FC = () => {
    const [isAuthStorage, setAuthStorage] = React.useState<boolean>(false);
    React.useMemo(() => {
        setAuthStorage(isUserLoggedIn());
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <RegisterProvider>
                    <PasswordProvider>
                        <UserProvider>
                            <WorkspaceDetailProvider>
                                <ReportProvider>
                                    <AppContainer
                                        isAuthStorage={isAuthStorage}
                                        setAuthStorage={setAuthStorage}
                                    />
                                </ReportProvider>
                            </WorkspaceDetailProvider>
                        </UserProvider>
                    </PasswordProvider>
                </RegisterProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
