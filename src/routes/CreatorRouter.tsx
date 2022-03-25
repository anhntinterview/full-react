import * as React from 'react';
// PACKAGE
import { Route, useHistory, useParams } from 'react-router-dom';
import PrivateRouteProvider from 'contexts/PrivateRoute/PrivateRouteProvider';
import { BarType } from 'constant/setupBars.const';
import userMiddleware from 'middleware/user.middleware';
import { UserContext } from 'contexts/User/UserContext';
import { Redirect } from 'react-router';
import { GetWorkspaceContext } from 'contexts/Workspace/WorkspaceContext';
import workspaceMiddleware from 'middleware/workspace.middleware';

// Requires authentication
const CreatorRoute: React.ComponentType<
    { barType?: BarType } & { [key: string]: any }
> = ({
    path,
    isAuthStorage,
    setAuthStorage,
    storageUserInfo,
    barType,
    component: Component,
    ...rest
}) => {
    const history = useHistory();
    const workspaceId = history.location.pathname.split('/')[2];
    const {
        dispatch: WorkspaceDispatch,
        getWorkspaceDetailState: { result: WorkspaceDetailInformation, err },
    } = React.useContext(GetWorkspaceContext);

    const {
        membership: { role, is_creator: isCreator },
    } = WorkspaceDetailInformation;

    React.useEffect(() => {
        if (WorkspaceDetailInformation.id === -1) {
            workspaceMiddleware.getWorkspace(WorkspaceDispatch, {
                id: workspaceId,
            });
        }
        // return () => workspaceMiddleware.resetUserState(WorkspaceDispatch);
    }, [WorkspaceDetailInformation]);
    return (
        (WorkspaceDetailInformation.id !== -1 && !err && (
            <Route
                path={path}
                {...rest}
                exact
                render={(props) => {
                    return isAuthStorage && isCreator && role === 'admin' ? (
                        <PrivateRouteProvider barType={barType}>
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
                                pathname: `/workspace/${workspaceId}/h5p-content`,
                                state: { from: props.location },
                            }}
                        />
                    );
                }}
            />
        )) ||
        (err && (
            <Redirect
                to={{
                    pathname: `/workspace/${workspaceId}`,
                }}
            />
        )) ||
        null
    );
};

export default CreatorRoute;
