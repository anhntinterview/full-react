import * as React from 'react';
// PACKAGE
import { Redirect, Route, useHistory } from 'react-router-dom';
import { SET_AUTH } from 'actions/auth.action';
// CONTEXT
import { AuthContext } from 'contexts/Auth/AuthContext';
// UTILS
import {
    changeFalseForLocalStorageCurrentAccount,
    getPreviousPath,
    isLocalStorageAuth,
    removePreviousPath,
    setLocalStorageAuthEmailData,
} from 'utils/handleLocalStorage';
import { getParamFromUrl } from 'utils/handleString';

// unauthenticated routes (redirect to home when authenticated)
const CommonRoute: React.ComponentType<any> = ({
    path,
    isAuthStorage,
    setAuthStorage,
    // setHeader,
    component: Component,
    ...rest
}) => {
    const history = useHistory();
    const params = history.location.search;
    const { authState, dispatch } = React.useContext(AuthContext);
    const { err } = authState;
    // CHECK HAVE WORKSPACE
    let hasWorkspace: string;
    if (params.indexOf('has_workspace') > -1) {
        hasWorkspace = getParamFromUrl(params, 'has_workspace');
    }
    console.log('LOGIN HERE!!!');
    // FROM EMAIL ROUTES
    let defaultPassword: boolean | undefined;
    let emailParam: string;
    if (params.indexOf('default_password') > -1) {
        changeFalseForLocalStorageCurrentAccount();
        setAuthStorage(isLocalStorageAuth());
        // add invite account information to LocalStorage
        const defaultPasswordParam = getParamFromUrl(
            params,
            'default_password'
        );

        if (defaultPasswordParam) {
            // add invite account information to LocalStorage
            emailParam = getParamFromUrl(params, 'email');
            defaultPassword = JSON.parse(defaultPasswordParam);
            setLocalStorageAuthEmailData(emailParam);
        }
    }
    // NO HEADER & SET DEFAULT PASSWORD
    React.useEffect(() => {
        if (defaultPassword) {
            dispatch({
                type: SET_AUTH.LOGIN_WITH_DEFAULT_PASSWORD,
                result: defaultPassword,
            });
        }
    }, []);

    React.useEffect(() => {
        if (isAuthStorage) {
            removePreviousPath();
        }
    }, [isAuthStorage]);

    return (
        <Route
            path={path}
            exact
            {...rest} // PROPS ITEM inside { ...rest } need inject to Component below
            render={(props) => {
                return isAuthStorage ? (
                    hasWorkspace === 'false' ? (
                        history.push('/workspace/create?isHeader=false')
                    ) : (
                        // Reminder: { ...rest } initial above, but have to pass PROPS ITEM inside Component below
                        <Redirect
                            to={{
                                pathname: (props.location.state as { from: Location })?.from?.pathname || getPreviousPath() || '/',
                                state: { from: props.location },
                            }}
                        />
                    )
                ) : (
                    <Component {...props} setAuthStorage={setAuthStorage} />
                );
            }}
        />
    );
};

export default CommonRoute;
