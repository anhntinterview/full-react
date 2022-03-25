import * as React from 'react';
// PACKAGE
import { Route, useHistory, useParams } from 'react-router-dom';
import PrivateRouteProvider from 'contexts/PrivateRoute/PrivateRouteProvider';
import { BarType, NewBarType } from 'constant/setupBars.const';
import userMiddleware from 'middleware/user.middleware';
import { UserContext } from 'contexts/User/UserContext';
import { Redirect } from 'react-router';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';

// Requires authentication
const AdminRouter: React.ComponentType<
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
        const history = useHistory();
        const workspaceId = history.location.pathname.split('/')[2];

        const {
            dispatch: WorkspaceDispatch,
            getWorkspaceDetailState: { result: WorkspaceDetailInformation, err },
        } = React.useContext(GetWorkspaceContext);

        const {
            membership: { role },
        } = WorkspaceDetailInformation;

        React.useEffect(() => {
            if (WorkspaceDetailInformation.id === -1) {
                workspaceMiddleware.getWorkspace(WorkspaceDispatch, {
                    id: workspaceId,
                });
            }
            // return () => workspaceMiddleware.resetUserState(WorkspaceDispatch);
        }, []);

        // React.useEffect(() => {
        //     if (err?.error?.name === AUTH_CONST.UNAUTHORIZED || err?.error?.name === AUTH_CONST.TOKEN_EXPIRED) {
        //         handleLogout(WorkspaceDispatch, setAuthStorage);
        //     }
        // }, [err]);
        return (
            <Route
                path={path}
                {...rest}
                exact
                render={(props) => {
                    return isAuthStorage && role !== 'member' ? (
                        <PrivateRouteProvider barType={barType} newBarType={newBar}>
                            <Component
                                {...props}
                                isAuthStorage={isAuthStorage}
                                setAuthStorage={setAuthStorage}
                                storageUserInfo={storageUserInfo}
                                role={'admin'}
                            />
                        </PrivateRouteProvider>
                    ) : (
                        <Redirect
                            to={{
                                pathname: `/workspace/${workspaceId}`,
                                state: { from: props.location },
                            }}
                        />
                    );
                }}
            />
        );
    };

export default AdminRouter;
