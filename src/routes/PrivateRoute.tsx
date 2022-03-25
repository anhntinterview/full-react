import * as React from 'react';
// PACKAGE
import {
    matchPath,
    Redirect,
    Route,
    useHistory,
    useLocation,
    useParams,
} from 'react-router';
import PrivateRouteProvider from 'contexts/PrivateRoute/PrivateRouteProvider';
import { BarType, NewBarType } from 'constant/setupBars.const';
import { handleRole } from 'components/H5P/H5PFN';
import { AuthContext } from 'contexts/Auth/AuthContext';
import Cookies from 'js-cookie';
import { AUTH_CONST } from 'constant/auth.const';
import { handleLogout } from 'utils/handleLogout';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';

// Requires authentication
const PrivateRoute: React.ComponentType<
    { barType?: BarType } & { [key: string]: any } & { newBar?: NewBarType }
> = ({
    path,
    isAuthStorage,
    setAuthStorage,
    storageUserInfo,
    barType,
    component: Component,
    newBar,
    ...rest
}) => {
    const {
        dispatch: WorkspaceDispatch,
        getWorkspaceDetailState: { result: WorkspaceDetailInformation },
    } = React.useContext(GetWorkspaceContext);

    const currentPath = matchPath(window.location.pathname, {
        path: '/workspace/:id',
        strict: false,
    });

    React.useEffect(() => {
        if (WorkspaceDetailInformation.id === -1 && currentPath) {
            const params: any = currentPath.params;
            workspaceMiddleware.getWorkspace(WorkspaceDispatch, {
                id: params.id,
            });
        }
        // return () => workspaceMiddleware.resetUserState(WorkspaceDispatch);
    }, []);
    
    return (
        <Route
            path={path}
            {...rest}
            exact
            render={(props) => {
                return isAuthStorage ? (
                    <PrivateRouteProvider barType={barType} newBarType={newBar}>
                        <Component
                            {...props}
                            isAuthStorage={isAuthStorage}
                            setAuthStorage={setAuthStorage}
                            storageUserInfo={storageUserInfo}
                        />
                    </PrivateRouteProvider>
                ) : (
                    <Redirect
                        to={{
                            pathname: '/login',
                            state: { from: props.location },
                        }}
                    />
                );
            }}
        />
    );
};

export default PrivateRoute;
